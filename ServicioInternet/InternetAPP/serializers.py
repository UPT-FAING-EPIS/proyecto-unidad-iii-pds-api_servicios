from rest_framework import serializers
from InternetAPP.models import CuentDeudInter

class DeudInterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CuentDeudInter
        fields = '__all__'
        read_only_fields = ('Estado','MonPago')

class DeudInterSerializer2(serializers.ModelSerializer):
    class Meta:
        model = CuentDeudInter
        fields = ('CodigoDeudInter','MonDeuda','MonPago')
        read_only_fields = ['MonDeuda']
