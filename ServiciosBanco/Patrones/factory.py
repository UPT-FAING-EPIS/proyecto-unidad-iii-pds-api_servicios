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
    _instance = None

    def __new__(cls, pago):
        if not cls._instance:
            cls._instance = super().__new__(cls)
            observerPago = PatterObserverPagos()
            Rabbitobserver = RabbitObserver()
            observerPago.attach_observer(Rabbitobserver)
            cls._instance._observerPago = observerPago
        return cls._instance

    def __init__(self, pago):
        self._pago = pago

    def pagar(self, deud_inter):
        strategy = DiscountPaymentStrategy()

        if datetime.date.today() > deud_inter.FechVenc:
            strategy = InterestPaymentStrategy()

        deud_inter_pago = strategy.calculate_payment(deud_inter.MonDeuda, deud_inter.FechVenc)

        deud_inter.MonDeuda = Decimal(deud_inter_pago) - Decimal(self._pago)

        if deud_inter.MonDeuda != 0:
            return {'mensaje': 'El Pago no es el debido', 'status': 400}

        self._observerPago.notify_observers("Pago Realizado", "ServicioInternet")
        deud_inter.Estado = 1
        deud_inter.save()

        if datetime.date.today() > deud_inter.FechVenc:
            return {'mensaje': f'Pago Realizado, con Interes de 20% siendo un total de: {deud_inter_pago}', 'status': 200}
        else:
            return {'mensaje': 'Pago Realizado Total', 'status': 200}


class ServicioAgua(IServicio):
    def __init__(self) -> None:
        super().__init__()
    def getDeuda(self, codigo_cliente):
        if not codigo_cliente:
            return Response({"error": "El parametro 'codigo_cliente' es obligatorio."}, status=400)
        pass

class ServicioEducacion(IServicio):
    def __init__(self, pago):
        self._pago = pago
    def pagar(self, deuda, cuenta):
        if deuda.Estado:
            return Response({'mensaje': 'La deuda ya ha sido pagada.'}, status=status.HTTP_400_BAD_REQUEST)

        monto_deuda = Decimal(deuda.CantidadDeuda)

        if self._pago != monto_deuda:
            return Response({'mensaje': 'El monto de pago no coincide con la cantidad de deuda.'}, status=status.HTTP_400_BAD_REQUEST)

        divisa_cuenta = cuenta.Divisa

        monto_pago_money = Money(self._pago, "PEN")
        monto_pago_convertido = monto_pago_money.convert(divisa_cuenta)

        if monto_pago_convertido.amount > cuenta.Monto:
            return Response({'mensaje': 'No hay montos suficientes en la cuenta.'}, status=status.HTTP_400_BAD_REQUEST)

        # Seleccionar la estrategia de cálculo de pago según la fecha de vencimiento
        strategy = DiscountPaymentStrategy()
        if datetime.date.today() > deuda.FechaVencimiento:
            strategy = InterestPaymentStrategy()

        monto_pago_final = strategy.calculate_payment(monto_pago_convertido.amount, deuda.FechaVencimiento)

        # Aplicar el descuento a la cuenta
        cuenta.Monto = cuenta.Monto - monto_pago_final
        cuenta.save()

        deuda.Estado = True
        deuda.save()

        observerPagos = PatterObserverPagos()
        
        observer = RabbitObserver()
        observerPagos.attach_observer(observer)
        monto_finalfinal = "{:.2f}".format(monto_pago_final)
        observerPagos.notify_observers('Pago realizado exitosamente. Monto final: {}'.format(monto_finalfinal), "ServicioEducacion")
        return Response({'mensaje': 'Pago realizado exitosamente. Monto final: {}'.format(monto_finalfinal)}, status=status.HTTP_200_OK)


class ServicioLuz(IServicio):
    def __init__(self, pago):
        self._pago = Decimal(pago)  # Convertir el pago a Decimal

    def pagar(self, deud_luz):
        observerPago = PatterObserverPagos()
        rabbit_observer = RabbitObserver()

        observerPago.attach_observer(rabbit_observer)

        strategy = DiscountPaymentStrategy()

        if datetime.date.today() > deud_luz.FechaVencimientoPago:
            strategy = InterestPaymentStrategy()

        deud_luz_pago = strategy.calculate_payment(deud_luz.Monto, deud_luz.FechaVencimientoPago)

        deud_luz.Monto = Decimal(deud_luz_pago) - self._pago  

        if deud_luz.Monto != 0:
            return {'mensaje': 'El pago no es el debido', 'status': 400}

        observerPago.notify_observers("Pago Realizado", "ServicioLuz")

        deud_luz.save()

        if datetime.date.today() > deud_luz.FechaVencimientoPago:
            return {'mensaje': f'Pago Realizado, con interés de 20% siendo un total de: {deud_luz_pago}',
                    'status': 200}
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
        
        
            
        
        
