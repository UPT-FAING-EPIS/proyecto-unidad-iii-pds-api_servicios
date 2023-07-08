from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.decorators import action
from post.models import Cliente, RegistroLlamadas, Plan, Factura
from post.api.serializers import ClienteSerializer ,RegistroLlamadasSerializer,PlanSerializer, FacturaSerializer
from datetime import date, timedelta
from post.api.FacturaBuilder import FacturaBuilder
from .factura_facade import FacturaFacade
from .command import CommandInvoker, CancelarServicioCommand
from .strategy import UpdateStrategy, DestroyStrategy, ClienteUpdateStrategy

class ClienteViewSet(ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer
    update_strategy = ClienteUpdateStrategy()

    @action(detail=True, methods=['put'])
    def cancelar_servicio(self, request, pk=None):
        cliente = self.get_object()

        invoker = CommandInvoker()
        invoker.set_command(CancelarServicioCommand(cliente))
        invoker.execute_command()

        serializer = self.serializer_class(cliente)
        return Response({'status': 'OK', 'message': 'Servicio cancelado correctamente.'})
    
    def update(self, request, pk=None):
        return UpdateStrategy().execute(self, request, pk=pk)

class RegistroLlamadasViewSet(ModelViewSet):
    queryset = RegistroLlamadas.objects.all()
    serializer_class = RegistroLlamadasSerializer
    update_strategy = UpdateStrategy()
    destroy_strategy = DestroyStrategy()

    def update(self, request, pk=None):
        return self.update_strategy.execute(self, request, pk=pk)

    def destroy(self, request, pk=None):
        return self.destroy_strategy.execute(self, request, pk=pk)


class PlanViewSet(ModelViewSet):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer
    update_strategy = UpdateStrategy()

    def update(self, request, pk=None):
        return self.update_strategy.execute(self, request, pk=pk)

class FacturaViewSet(ModelViewSet):
    queryset = Factura.objects.all()
    serializer_class = FacturaSerializer
    update_strategy = UpdateStrategy()
    destroy_strategy = DestroyStrategy()

    def update(self, request, *args, **kwargs):
        return self.update_strategy.execute(self, request, *args, **kwargs)
        
    def destroy(self, request, pk=None):
        return self.destroy_strategy.execute(self, request, pk=pk)
    

@api_view(['POST'])
def crear_plan_con_factura(request):
    serializer = PlanSerializer(data=request.data)
    if serializer.is_valid():
        plan = serializer.save()

        cliente_id = request.data.get('cliente_id')
        cliente = Cliente.objects.get(pk=cliente_id)
        fecha_emision = date.today()
        dias_vencimiento = 30
        fecha_vencimiento = fecha_emision + timedelta(days=dias_vencimiento)
        monto = plan.costo_mensual

        factura = FacturaFacade.crear_factura(cliente, plan, fecha_emision, fecha_vencimiento, monto)

        serializer = FacturaSerializer(factura)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)



@api_view(['POST'])
def pagar_factura(request):
    factura_id = request.data['id']
    FacturaFacade.pagar_factura(factura_id)
    return Response({'mensaje': 'La factura ha sido pagada.'})

