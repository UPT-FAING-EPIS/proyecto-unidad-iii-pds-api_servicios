# from rest_framework.decorators import action, api_view
# from rest_framework.response import Response
# from rest_framework import status
# from post.models import Cliente, Factura
# from post.api.serializers import PlanSerializer, FacturaSerializer
# from datetime import date, timedelta
# from post.api.FacturaBuilder import FacturaBuilder
# from .factura_facade import FacturaFacade
# from .command import CommandInvoker, CancelarServicioCommand

# # Decorator base
# class Decorators:
#     def __init__(self, viewset):
#         self.viewset = viewset

#     def __getattr__(self, name):
#         return getattr(self.viewset, name)

# # Decorator específico para cancelar el servicio
# class CancelarServicioDecorator(Decorators):
#     @action(detail=True, methods=['put'])
#     def cancelar_servicio(self, request, pk=None):
#         cliente = self.get_object()

#         invoker = CommandInvoker()
#         invoker.set_command(CancelarServicioCommand(cliente))
#         invoker.execute_command()

#         serializer = self.serializer_class(cliente)
#         return Response({'status': 'OK', 'message': 'Servicio cancelado correctamente.'})

# # Decorator específico para crear un plan con factura
# class CrearPlanConFacturaDecorator(Decorators):
#     def __init__(self, viewset):
#         super().__init__(viewset)

#     @api_view(['POST'])
#     def crear_plan_con_factura(self, request):
#         serializer = PlanSerializer(data=request.data)
#         if serializer.is_valid():
#             plan = serializer.save()

#             cliente_id = request.data.get('cliente_id')
#             cliente = Cliente.objects.get(pk=cliente_id)
#             fecha_emision = date.today()
#             dias_vencimiento = 30
#             fecha_vencimiento = fecha_emision + timedelta(days=dias_vencimiento)
#             monto = plan.costo_mensual

#             factura = FacturaFacade.crear_factura(cliente, plan, fecha_emision, fecha_vencimiento, monto)

#             serializer = FacturaSerializer(factura)
#             return Response(serializer.data, status=status.HTTP_201_CREATED)
#         else:
#             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# # Decorator específico para pagar una factura
# class PagarFacturaDecorator(Decorators):
#     def __init__(self, viewset):
#         super().__init__(viewset)

#     @api_view(['POST'])
#     def pagar_factura(self, request):
#         factura_id = request.data['id']
#         FacturaFacade.pagar_factura(factura_id)
#         return Response({'mensaje': 'La factura ha sido pagada.'})
