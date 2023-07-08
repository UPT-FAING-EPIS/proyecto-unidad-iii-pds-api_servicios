from django.db import models

class ReciboAgua(models.Model):
    cliente = models.CharField(max_length=200)
    fecha_emision = models.DateField()
    fecha_vencimiento = models.DateField()
    monto = models.DecimalField(max_digits=8, decimal_places=2)
    pagado = models.BooleanField(default=False)

    def __str__(self):
        return self.cliente
