# Generated by Django 4.2 on 2023-04-29 17:54

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('post', '0003_rename_fecha_factura_fecha_emision_factura_estado_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='factura',
            name='fecha_vencimiento',
            field=models.DateField(default=datetime.date(2023, 5, 29)),
        ),
    ]
