from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from .models import tbCuenta, tbDeudasAlumno
from Patrones.factory import DeudInterPagoFactory


class PagoDebitoViews(APIView):
    def post(self, request):
        codigo_deuda = request.data.get('CodigoDeuda')
        codigo_cuenta = request.data.get('CodigoCuenta')
        monto_pago = request.data.get('MontoPago')

        deuda = get_object_or_404(tbDeudasAlumno.objects.using('BaseDatosEducacion'), CodigoDeuda=codigo_deuda)
        cuenta = get_object_or_404(tbCuenta.objects.using('BaseDatosEducacion'), CodigoCuenta=codigo_cuenta)

        factoria = DeudInterPagoFactory.create("ServicioEducacion", monto_pago)
        return factoria.pagar(deuda, cuenta)
