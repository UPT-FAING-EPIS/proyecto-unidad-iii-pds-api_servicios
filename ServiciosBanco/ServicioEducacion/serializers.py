from rest_framework import serializers
from .models import tbAlumno, tbDeudasAlumno, tbPagosAlumno

class tbAlumnoSerializer(serializers.ModelSerializer):
    class Meta:
        model = tbAlumno
        fields = '__all__'

    def create(self, validated_data):
        instance = self.Meta.model.objects.using('BaseDatosEducacion').create(**validated_data)
        return instance

class tbDeudasAlumnoSerializer(serializers.ModelSerializer):
    fkCodigoAlumno = serializers.PrimaryKeyRelatedField(queryset=tbAlumno.objects.using('BaseDatosEducacion').all())

    class Meta:
        model = tbDeudasAlumno
        fields = '__all__'
        
    def create(self, validated_data):
        instance = self.Meta.model.objects.using('BaseDatosEducacion').create(**validated_data)
        return instance
    
class tbPagosAlumnoSerializer(serializers.ModelSerializer):
    FKCodigoDeuda = serializers.PrimaryKeyRelatedField(queryset=tbDeudasAlumno.objects.using('BaseDatosEducacion').all())

    class Meta:
        model = tbPagosAlumno
        fields = '__all__'
        
    def create(self, validated_data):
        instance = self.Meta.model.objects.using('BaseDatosEducacion').create(**validated_data)
        return instance