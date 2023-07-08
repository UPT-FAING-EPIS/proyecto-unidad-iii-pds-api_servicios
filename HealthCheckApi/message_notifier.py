from twilio.rest import Client
from observer import Observer

class HealthCheckNotifier(Observer):
    def __init__(self, account_sid, auth_token, from_number, to_number):
        self.client = Client(account_sid, auth_token)
        self.from_number = from_number
        self.to_number = to_number

    def update(self, message):
        print("se noto un cambio")
        database_status = message['database']
        error_services = []

        if database_status['BaseDatosLuz'] == 'error':
            error_services.append('BaseDatosLuz')
        if database_status['BaseDatosAgua'] == 'error':
            error_services.append('BaseDatosAgua')
        if database_status['BaseDatosTelefonia'] == 'error':
            error_services.append('BaseDatosTelefonia')
        if database_status['BaseDatosEducacion'] == 'error':
            error_services.append('BaseDatosEducacion')
        if database_status['BaseDatosInternet'] == 'error':
            error_services.append('BaseDatosInternet')

        if error_services:
            error_message = 'Los siguientes servicios tienen estado de error: {}'.format(', '.join(error_services))
            print(error_message)
            message = self.client.messages.create(
                from_=self.from_number,
                body=error_message,
                to=self.to_number
            )
            print(message)
            print(message.status)
            