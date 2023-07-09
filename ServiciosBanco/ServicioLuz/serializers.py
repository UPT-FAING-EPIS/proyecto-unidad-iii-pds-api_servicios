from rest_framework import serializers
from .models import TbPagos
from .models import TbDeuda
from .models import TbClientes

class PagosSerializer(serializers.ModelSerializer):
    CodigoDeuda = serializers.PrimaryKeyRelatedField(queryset=TbDeuda.objects.using('BaseDatosLuz').all())
    class Meta:
        model = TbPagos
        fields = '__all__'

class DeudaSerializer(serializers.ModelSerializer):
    FkCodigoCliente = serializers.PrimaryKeyRelatedField(queryset=TbClientes.objects.using('BaseDatosLuz').all())
    class Meta:
        model = TbDeuda
        fields = '__all__'
