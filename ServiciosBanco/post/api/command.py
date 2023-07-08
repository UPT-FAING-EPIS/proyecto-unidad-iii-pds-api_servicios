# Command Interface
class command:
    def execute(self):
        pass

# Concrete Command
class CancelarServicioCommand(command):
    def __init__(self, cliente):
        self.cliente = cliente

    def execute(self):
        self.cliente.servicio_activo = False
        self.cliente.save()

# Invoker
class CommandInvoker:
    def __init__(self):
        self.command = None

    def set_command(self, command):
        self.command = command

    def execute_command(self):
        if self.command is not None:
            self.command.execute()
