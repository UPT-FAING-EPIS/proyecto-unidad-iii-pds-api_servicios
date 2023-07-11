from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from decimal import Decimal
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.decorators import action
from post.models import Cliente, RegistroLlamadas, Plan, Factura
from post.api.serializers import ClienteSerializer ,RegistroLlamadasSerializer,PlanSerializer, FacturaSerializer
from datetime import date, timedelta

from Patrones.observers import PatterObserverPagos, RabbitObserver
from Patrones.factory import DeudInterPagoFactory

pattern_observer = PatterObserverPagos()


class ClienteViewSet(ModelViewSet):
    queryset = Cliente.objects.using('BaseDatosTelefonia').all()
    serializer_class = ClienteSerializer


    @action(detail=True, methods=['put'])
    def cancelar_servicio(self, request, pk=None):
        cliente = self.get_object()
        cliente.servicio_activo = False
        cliente.save()
        serializer = self.serializer_class(cliente)
        return Response({'status': 'OK', 'message': 'Servicio cancelado correctamente.'})

    def update(self, request, pk=None):
        cliente = self.get_object()
        serializer = ClienteSerializer(cliente, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)

class RegistroLlamadasViewSet(ModelViewSet):
    queryset = RegistroLlamadas.objects.using('BaseDatosTelefonia').all()
    serializer_class = RegistroLlamadasSerializer

class PlanViewSet(ModelViewSet):
    queryset = Plan.objects.using('BaseDatosTelefonia').all()
    serializer_class = PlanSerializer

    def update(self, request, pk=None):
        plan = self.get_object()
        serializer = PlanSerializer(plan, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)

class FacturaViewSet(ModelViewSet):
    queryset = Factura.objects.using('BaseDatosTelefonia').all()
    serializer_class = FacturaSerializer

    def update(self, request, pk=None):
        factura = self.get_object()
        serializer = FacturaSerializer(factura, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=400)
        
    def destroy(self, request, pk=None):
        factura = self.get_object()
        factura.delete()
        return Response({'status': 'OK', 'message': 'Factura eliminada correctamente.'})

    @action(detail=False, methods=['post'])
    def activar_plan(self, request):
        cliente_id = request.data.get('cliente_id')
        plan_id = request.data.get('plan_id')
        monto_pago = request.data.get('monto_pago')

        try:
            cliente = Cliente.objects.using('BaseDatosTelefonia').get(pk=cliente_id)
            plan = Plan.objects.using('BaseDatosTelefonia').get(pk=plan_id)
        except (Cliente.DoesNotExist, Plan.DoesNotExist):
            return Response({'mensaje': 'Cliente o plan no encontrado.'}, status=status.HTTP_400_BAD_REQUEST)

        if Decimal(monto_pago) != Decimal(plan.costo_mensual):
            return Response({'mensaje': 'El monto del pago no coincide con el costo mensual del plan.'}, status=status.HTTP_400_BAD_REQUEST)

        fecha_emision = date.today()
        fecha_vencimiento = fecha_emision + timedelta(days=30)

        factura = Factura.objects.using('BaseDatosTelefonia').create(
            cliente=cliente,
            plan=plan,
            monto=monto_pago,
            fecha_emision=fecha_emision,
            fecha_vencimiento=fecha_vencimiento,
            pagado=True,
            estado=True
        )

        command = DeudInterPagoFactory.create("ServicioTelefonia",monto_pago)
        factoria = DeudInterPagoFactory.create("ServicioTelefonia",monto_pago)
        result = command.pagar(monto_pago)

        return Response({'mensaje': result['mensaje']}, status=result['status'])
