from rest_framework.serializers import ModelSerializer
from rest_framework import serializers
from post.models import Cliente , RegistroLlamadas, Plan, Factura


class ClienteSerializer(ModelSerializer):
    class Meta:
        model = Cliente
        fields = '__all__'

    def create(self, validated_data):
        instance = self.Meta.model.objects.using('BaseDatosTelefonia').create(**validated_data)
        return instance

class RegistroLlamadasSerializer(ModelSerializer):
    class Meta:
        model = RegistroLlamadas
        fields = '__all__'
    def create(self, validated_data):
        instance = self.Meta.model.objects.using('BaseDatosTelefonia').create(**validated_data)
        return instance

class PlanSerializer(ModelSerializer):
    class Meta:
        model = Plan
        fields = '__all__'
    def create(self, validated_data):
        instance = self.Meta.model.objects.using('BaseDatosTelefonia').create(**validated_data)
        return instance

class FacturaSerializer(ModelSerializer):
    class Meta:
        model = Factura
        fields = '__all__'
    def create(self, validated_data):
        instance = self.Meta.model.objects.using('BaseDatosTelefonia').create(**validated_data)
        return instance