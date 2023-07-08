from post.api.FacturaBuilder import FacturaBuilder
from post.models import Factura

class FacturaFacade:
    @staticmethod
    def crear_factura(cliente, plan, fecha_emision, fecha_vencimiento, monto):
        factura_builder = FacturaBuilder(cliente, plan, fecha_emision, fecha_vencimiento, monto)
        factura_builder.set_pagado(False)
        factura_builder.set_estado(True)
        factura = factura_builder.build()
        factura.save()
        return factura

    @staticmethod
    def pagar_factura(factura_id):
        factura = Factura.objects.get(id=factura_id)
        factura.pagado = True
        factura.estado = False
        factura.save()
