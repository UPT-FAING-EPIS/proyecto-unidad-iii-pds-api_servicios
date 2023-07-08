from rest_framework import status
from rest_framework.response import Response

class Strategy:
    def execute(self, viewset, request, *args, **kwargs):
        raise NotImplementedError("Subclasses must implement execute().")

class UpdateStrategy(Strategy):
    def execute(self, viewset, request, *args, **kwargs):
        instance = viewset.get_object()
        serializer = viewset.serializer_class(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class DestroyStrategy(Strategy):
    def execute(self, viewset, request, *args, **kwargs):
        instance = viewset.get_object()
        instance.delete()
        return Response({'status': 'OK', 'message': 'Eliminado correctamente.'})

class ClienteUpdateStrategy(Strategy):
    def execute(self, viewset, request, *args, **kwargs):
        cliente = viewset.get_object()
        cliente.servicio_activo = False
        cliente.save()
        serializer = viewset.serializer_class(cliente)
        return Response({'status': 'OK', 'message': 'Servicio cancelado correctamente.'})
