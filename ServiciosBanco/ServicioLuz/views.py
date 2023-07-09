import json
from rest_framework import generics
from rest_framework.response import Response
from .models import TbDeuda,TbPagos
from .serializers import DeudaSerializer,PagosSerializer
from rest_framework.generics import RetrieveAPIView, UpdateAPIView, DestroyAPIView
from Patrones.factory import DeudInterPagoFactory
from datetime import datetime

class DeudaDTO:
    def __init__(self, codigo_deuda, fk_codigocliente, fecha_vencimiento_pago, monto, estado):
        self.codigo_deuda = codigo_deuda
        self.fk_codigocliente = fk_codigocliente
        self.fecha_vencimiento_pago = fecha_vencimiento_pago.strftime('%Y-%m-%d')
        self.monto = monto
        self.estado = estado

    def to_dict(self):
        return {
            'codigo_deuda': self.codigo_deuda,
            'fk_codigocliente': self.fk_codigocliente,
            'fecha_vencimiento_pago': self.fecha_vencimiento_pago,
            'monto': self.monto,
            'estado': self.estado
        }


class PagoDTO:
    def __init__(self, codigo_pago, codigo_deuda, pago, fecha_pago):
        self.codigo_pago = codigo_pago
        self.codigo_deuda = codigo_deuda
        self.monto_pago = pago
        self.fecha_pago = fecha_pago.strftime('%Y-%m-%d')

    def to_dict(self):
        return {
            'codigo_pago': self.codigo_pago,
            'codigo_deuda': self.codigo_deuda,
            'monto_pago': self.monto_pago,
            'fecha_pago': self.fecha_pago
        }


class DeudaDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TbDeuda.objects.using('BaseDatosLuz').all()
    serializer_class = DeudaSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        deuda_dto = self.to_deuda_dto(instance)
        return Response(deuda_dto.to_dict())

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        deuda_dto = self.to_deuda_dto(instance)
        return Response(deuda_dto.to_dict())

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'mensaje': 'Deuda eliminada correctamente'})

    def to_deuda_dto(self, deuda):
        return DeudaDTO(
            codigo_deuda=deuda.CodigoDeuda,
            fk_codigocliente=deuda.FkCodigoCliente_id,
            fecha_vencimiento_pago=deuda.FechaVencimientoPago,
            monto=deuda.Monto,
            estado=deuda.Estado
        )


class PagoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TbPagos.objects.using('BaseDatosLuz').all()
    serializer_class = PagosSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        pago_dto = self.to_pago_dto(instance)
        return Response(pago_dto.to_dict())

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        pago_dto = self.to_pago_dto(instance)
        return Response(pago_dto.to_dict())

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'mensaje': 'Pago eliminado correctamente'})

    def to_pago_dto(self, pago):
        return PagoDTO(
            codigo_pago=pago.CodigoPago,
            pago=pago.Pago,
            fecha_pago=pago.FechaPago,
            codigo_deuda=pago.CodigoDeuda_id, 

        )

class DeudaListView(generics.ListCreateAPIView):
    queryset = TbDeuda.objects.using('BaseDatosLuz').all()
    serializer_class = DeudaSerializer

class PagoListView(generics.ListCreateAPIView):
    queryset = TbPagos.objects.using('BaseDatosLuz').all()
    serializer_class = PagosSerializer

    def post(self, request, *args, **kwargs):
        codigo_deuda = request.data.get('CodigoDeuda', None)
        codigo_pago = request.data.get('CodigoPago', None)

        if codigo_deuda is None:
            return Response({'error': 'El campo CodigoDeuda es requerido.'}, status=400)

        deuda = TbDeuda.objects.filter(CodigoDeuda=codigo_deuda).first()
        if deuda is None:
            return Response({'error': f'La deuda con CodigoDeuda={codigo_deuda} no existe.'}, status=400)

        monto_pago = float(request.data.get('Pago', 0))
        fecha_pago_str = request.data.get('FechaPago', datetime.now())
        fecha_pago = datetime.strptime(fecha_pago_str, '%Y-%m-%d').date()

        if deuda.FechaVencimientoPago != fecha_pago:
            deuda.Monto += 80
            deuda.save()
            return Response({'mensaje': 'La fecha de pago y vencimiento no coinciden. Se agregaron S/80 a la deuda.'})

        if monto_pago != deuda.Monto:
            return Response({'error': 'El monto de pago no coincide con la deuda. Se interrumpe la operación.'}, status=400)

        pago = TbPagos(CodigoPago=codigo_pago, CodigoDeuda=deuda, Pago=monto_pago, FechaPago=fecha_pago)
        pago.save()
        deuda.Estado = 'pagado'
        deuda.save()

        command = DeudInterPagoFactory.create("ServicioLuz", pago.Pago)

        result = command.pagar(deuda)

        serializer = self.get_serializer(pago)
        response_data = {'mensaje': result['mensaje'], 'data': serializer.data}
        return Response(response_data, status=result['status'])