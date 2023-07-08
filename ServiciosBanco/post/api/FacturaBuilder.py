from post.models import Factura

class FacturaBuilder:
    def __init__(self, cliente, plan, fecha_emision, fecha_vencimiento, monto):
        self.factura = Factura()
        self.factura.cliente = cliente
        self.factura.plan = plan
        self.factura.fecha_emision = fecha_emision
        self.factura.fecha_vencimiento = fecha_vencimiento
        self.factura.monto = monto

    def set_pagado(self, pagado):
        self.factura.pagado = pagado
        return self

    def set_estado(self, estado):
        self.factura.estado = estado
        return self

    def build(self):
        return self.factura
