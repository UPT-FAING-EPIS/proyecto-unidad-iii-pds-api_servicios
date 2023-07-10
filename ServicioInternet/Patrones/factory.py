import datetime
from decimal import Decimal
from rest_framework import status
from rest_framework.response import Response
from Patrones.money import Money

from Patrones.observers import PatterObserverPagos, RabbitObserver
from Patrones.Strategy import DiscountPaymentStrategy, InterestPaymentStrategy


class IServicio:
    def pagar():
        pass
        
class ServicioInternet(IServicio):
    def __init__(self, pago):
        self._pago=pago
        
    def pagar(self, deud_inter):
        observerPago = PatterObserverPagos()
        Rabbitobserver = RabbitObserver()

        observerPago.attach_observer(Rabbitobserver)
        
        strategy = DiscountPaymentStrategy()
        
        if datetime.date.today() > deud_inter.FechVenc:
            strategy = InterestPaymentStrategy()

        deud_inter_pago = strategy.calculate_payment(deud_inter.MonDeuda,deud_inter.FechVenc )

        deud_inter.MonDeuda = Decimal(deud_inter_pago) - Decimal(self._pago)
        
        if(deud_inter.MonDeuda!=0):
            return {'mensaje': 'El Pago no es el debido', 'status': 400}

        observerPago.notify_observers("Pago Realizado","ServicioInternet")
        deud_inter.Estado = 1

        deud_inter.save()
        
        if datetime.date.today() > deud_inter.FechVenc:
            return {'mensaje': f'Pago Realizado, con Interes de 20% siendo un total de: {deud_inter_pago}', 'status': 200}
        else:
            return {'mensaje': 'Pago Realizado Total', 'status': 200}
      
class DeudInterPagoFactory:
    def create(nameservicio,pagar):
        if (nameservicio=="ServicioInternet"):
            return ServicioInternet(pagar)

        if (nameservicio=="ServicioEducacion"):
            return ServicioEducacion(pagar)
            
        if (nameservicio == "ServicioLuz"):
            return ServicioLuz(pagar)
        
        
            
        
        
