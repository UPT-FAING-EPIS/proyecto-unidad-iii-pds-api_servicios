from Patrones.rabbitmq import RabbitMq

class PatterObserverPagos:
    _instance = None
    _observers = []

    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super().__new__(cls, *args, **kwargs)
        return cls._instance

    def attach_observer(self, observer):
        self._observers.append(observer)

    def detach_observer(self, observer):
        self._observers.remove(observer)

    def notify_observers(self,message,rootingkey):
        for observer in self._observers:
            observer.update(message,rootingkey)

class Observer:
    def update(self,message,rootingkey):
        pass

class RabbitObserver(Observer):
    def update(self,message,rootingkey):
        pass
        #RabbitMq.rabbitmqMessage(message,rootingkey)
        
        

