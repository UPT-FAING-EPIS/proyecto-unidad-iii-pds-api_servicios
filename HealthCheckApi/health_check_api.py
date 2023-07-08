from flask import Flask
import requests
from observer import Observable
from flask import Flask, render_template

class HealthCheckAPI(Observable):
    def __init__(self):
        super().__init__()
        self.app = Flask(__name__)

        @self.app.route('/health')
        def health_check():
            url = 'http://127.0.0.1:8000/ServicioEducacion/health/'
            response = requests.get(url)
            health_status = response.json()
            self.notify_observers(health_status)
            print("ConsumeCorrectamente")
            return health_status
        @self.app.route('/')
        def monitor():
            return render_template('monitor.html')

    def run(self):
        self.app.run()
