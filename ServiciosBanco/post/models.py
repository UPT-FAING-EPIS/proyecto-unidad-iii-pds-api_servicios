from django.db import models
import datetime
# Create your models here.

class Cliente(models.Model):
    nombre = models.CharField(max_length=100)
    direccion = models.CharField(max_length=200, default='Desconocido')
    telefono = models.CharField(max_length=20)
    cuenta_bancaria = models.CharField(max_length=20)
    servicio_activo = models.BooleanField(default=True) 

    def __str__(self):
        return self.nombre

class RegistroLlamadas(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    fecha_hora = models.DateTimeField(auto_now_add=True)
    duracion = models.PositiveIntegerField()

class Plan(models.Model):
    nombre = models.CharField(max_length=100)
    costo_mensual = models.DecimalField(max_digits=10, decimal_places=2)
    minutos_incluidos = models.IntegerField()
    datos_incluidos = models.IntegerField()

    def __str__(self):
        return self.nombre

class Factura(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_emision = models.DateField()
    fecha_vencimiento = models.DateField(default=datetime.date.today() + datetime.timedelta(days=30))
    pagado = models.BooleanField(default=False)
    estado = models.BooleanField(default=True)

    def __str__(self):
        return f"Factura para {self.cliente} en {self.fecha_emision}"