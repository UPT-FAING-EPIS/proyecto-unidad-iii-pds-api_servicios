from decimal import Decimal
class Money:
    def __init__(self, amount, currency):
        self.amount = amount
        self.currency = currency

    def convert(self, target_currency):
        conversion_rates = {
            "EUR": Decimal('3.93'),  
            "USD": Decimal('3.65'), 
            "PEN": Decimal('1')  
        }

        if self.currency == target_currency:
            return Money(self.amount, self.currency)

        conversion_rate = conversion_rates.get(self.currency)
        if conversion_rate:
            converted_amount = Decimal(self.amount) * conversion_rate
            target_conversion_rate = conversion_rates.get(target_currency)
            if target_conversion_rate:
                converted_amount /= target_conversion_rate
                return Money(converted_amount, target_currency)

        raise ValueError(f"No se encontró una tasa de conversión válida para {self.currency} a {target_currency}")
