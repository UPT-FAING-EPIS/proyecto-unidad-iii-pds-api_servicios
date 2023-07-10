from rest_framework import serializers
from .models import CuentDeudInter

class DeudInterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CuentDeudInter
        fields = '__all__'
        read_only_fields = ('Estado','MonPago')
    def create(self, validated_data):
        instance = self.Meta.model.objects.using('BaseDatosInternet').create(**validated_data)
        return instance

class DeudInterSerializer2(serializers.ModelSerializer):
    class Meta:
        model = CuentDeudInter
        fields = ('CodigoDeudInter','MonDeuda','MonPago')
        read_only_fields = ['MonDeuda']
    def create(self, validated_data):
        instance = self.Meta.model.objects.using('BaseDatosInternet').create(**validated_data)
        return instance
