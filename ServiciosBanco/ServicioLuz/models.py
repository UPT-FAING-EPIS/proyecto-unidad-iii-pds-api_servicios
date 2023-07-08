from django.db import models

class TbClientes(models.Model):
    CodigoCliente = models.CharField(max_length=255,primary_key=True)
    Nombre = models.CharField(max_length=255)
    Apellido = models.CharField(max_length=255)
    Direccion = models.CharField(max_length=255)
    Ciudad = models.CharField(max_length=255)
    Telefono  = models.IntegerField()
    class Meta:
        db_table = "TbClientes"

class TbDeuda(models.Model):
    CodigoDeuda = models.CharField(max_length=255,primary_key=True)
    FkCodigoCliente = models.ForeignKey(TbClientes, on_delete=models.CASCADE)
    FechaVencimientoPago = models.DateField()
    Monto = models.DecimalField(max_digits=10, decimal_places=2)
    Estado = models.CharField(max_length=255)
    class Meta:
        db_table = "TbDeuda"


class TbPagos(models.Model):
    CodigoPago= models.CharField(max_length=255,primary_key=True)
    CodigoDeuda = models.ForeignKey(TbDeuda, on_delete=models.CASCADE)
    Pago = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    FechaPago = models.DateField()
    class Meta:
        db_table = "TbPagos"