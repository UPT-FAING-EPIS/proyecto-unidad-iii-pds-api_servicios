import pika
import datetime
import json

rabbitmq_host = "localhost"
rabbitmq_port = "5672"
rabbitmq_username = "guest"
rabbitmq_password = "guest"

class RabbitMq():
    _instance = None
    
    def __new__(cls,*args, **kwargs):
        if not cls._instance:
            cls._instance = super().__new__(cls, *args, **kwargs)
        return cls._instance
    
    def rabbitmqMessage(message="error", routing_key="error"):
        log = {
            "timestamp": datetime.datetime.now().isoformat(),
            "Level": routing_key,
            "Message": json.dumps(message)
        }
        credentials = pika.PlainCredentials(rabbitmq_username, rabbitmq_password)
        connection = pika.BlockingConnection(
            pika.ConnectionParameters(
                host=rabbitmq_host,
                port=rabbitmq_port,
                credentials=credentials
            )
        )
        channel = connection.channel()
        channel.queue_declare(queue="logsPago")
        channel.basic_publish(
            exchange='', routing_key="logsPago", body=json.dumps(log)
        )
        connection.close()

