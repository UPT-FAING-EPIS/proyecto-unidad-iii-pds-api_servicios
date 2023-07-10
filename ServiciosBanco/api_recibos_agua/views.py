from django.http import JsonResponse
from rest_framework.generics import ListCreateAPIView
from api_recibos_agua import serializers,scraping,models
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from api_recibos_agua import models
from datetime import datetime, timedelta
class DeudaViews(APIView):

    def post(self, request, *args, **kwargs):
        codigo_cliente = request.data.get("codigo_cliente")
        print(codigo_cliente)
        if not codigo_cliente:
            return JsonResponse({"error": "El parametro 'codigo_cliente' es obligatorio."}, status=400)

        correo = "apiagua@gmail.com"
        dni = "87654321"
        url = "https://pagovisa.epstacna.com.pe:8443"

        deuda = scraping.obtener_deuda(url, codigo_cliente, correo, dni)

        if deuda is not None:

            recibo_agua = models.ReciboAgua(
                cliente=codigo_cliente,
                fecha_emision=datetime.now(),
                fecha_vencimiento=datetime.now() + timedelta(days=30),
                monto=deuda,
                pagado=False
            )
            recibo_agua.save()

            return JsonResponse({"deuda": deuda})
        else:
            return JsonResponse({"error": "No se encontro informacion de deuda para el cliente."})


class PagosViews(ListCreateAPIView):
    queryset = models.ReciboAgua.objects.all()
    serializer_class = serializers.ReciboAguaSerializer