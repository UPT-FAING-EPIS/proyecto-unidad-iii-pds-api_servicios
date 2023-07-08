from django.db import models

# Create your models here.
class CuentDeudInter(models.Model):
    CodigoDeudInter = models.IntegerField(primary_key=True)
    Nombre = models.CharField(max_length=255)
    Apellido = models.CharField(max_length=255)
    MonDeuda = models.DecimalField(max_digits=10, decimal_places=2)
    MonPago = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    FechVenc = models.DateField()
    Estado = models.BooleanField(default=True)
    class Meta:
        db_table = "tbCuentaDeudInter"