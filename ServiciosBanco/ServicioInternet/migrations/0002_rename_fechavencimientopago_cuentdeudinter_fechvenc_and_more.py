# Generated by Django 4.2 on 2023-04-29 04:34

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('ServicioInternet', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='cuentdeudinter',
            old_name='FechaVencimientoPago',
            new_name='FechVenc',
        ),
        migrations.RenameField(
            model_name='cuentdeudinter',
            old_name='MontoDeuda',
            new_name='MonDeuda',
        ),
        migrations.RenameField(
            model_name='cuentdeudinter',
            old_name='MontoPago',
            new_name='MonPago',
        ),
    ]
