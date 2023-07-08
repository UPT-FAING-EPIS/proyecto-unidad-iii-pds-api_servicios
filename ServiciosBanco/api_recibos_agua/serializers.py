from rest_framework import serializers
from .models import ReciboAgua

class ReciboAguaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReciboAgua
        fields = '__all__'
