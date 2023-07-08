from rest_framework.serializers import ModelSerializer
from post.models import Cliente , RegistroLlamadas, Plan, Factura


class ClienteSerializer(ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'

class RegistroLlamadasSerializer(ModelSerializer):
    class Meta:
        model = RegistroLlamadas
        fields = '__all__'


class PlanSerializer(ModelSerializer):
    class Meta:
        model = Plan
        fields = '__all__'

class FacturaSerializer(ModelSerializer):
    class Meta:
        model = Factura
        fields = '__all__'