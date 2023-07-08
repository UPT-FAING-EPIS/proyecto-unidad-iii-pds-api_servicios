import uuid
from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import tbDeudasAlumno
from .serializers import tbPagosAlumnoSerializer
from reportlab.pdfgen import canvas
from io import BytesIO

class Component:
    """
    La interfaz de componente base define operaciones que los decoradores pueden modificar.
    """

    def operation(self) -> str:
        pass


class ConcreteComponent(Component):
    """
    Los componentes concretos proporcionan implementaciones predeterminadas de las operaciones.
    """

    def __init__(self, pago):
        self.pago = pago

    def operation(self) -> str:
        return "Payment completed successfully"


class ReceiptDecorator(Component):
    """
    La clase base ReceiptDecorator sigue la misma interfaz que otros componentes.
    Actúa como envoltorio para todos los concrete decorators .
    """

    _component: Component = None

    def __init__(self, component: Component) -> None:
        self._component = component

    @property
    def component(self) -> Component:
        """
        El ReceiptDecorator delega todo el trabajo al wrapped component.
        """

        return self._component

    def operation(self) -> str:
        return self._component.operation()


class PdfReceiptDecorator(ReceiptDecorator):
    """
    Los Concrete Decorators agregan funcionalidad al componente que envuelven(wrapper).
    """

    def operation(self) -> str:
        # Generate the PDF receipt
        pdf_buffer = BytesIO()

        # Create a Canvas object for the PDF
        c = canvas.Canvas(pdf_buffer)

        # Add the payment details to the receipt
        c.drawString(100, 750, "Recibo de Pago")
        c.drawString(100, 700, f"ID de Pago: {str(uuid.uuid4())}")  # Generate a random UUID for the payment
        c.drawString(100, 650, f"Monto: {self.component.pago.MontoPago}")

        # Save and close the PDF file
        c.save()

        # Get the PDF content from the buffer
        pdf_content = pdf_buffer.getvalue()
        pdf_buffer.close()

        # Save the PDF file to disk (optional)
        with open("recibo_pago.pdf", "wb") as f:
            f.write(pdf_content)

        return f"{self.component.operation()}, Receipt: recibo_pago.pdf"


class RealizarPagoViews(APIView):
    def post(self, request):
        codigo_deuda = request.data.get('CodigoDeuda')
        monto_pago = request.data.get('MontoPago')
        deuda = get_object_or_404(tbDeudasAlumno.objects.using('BaseDatosEducacion'), CodigoDeuda=codigo_deuda)
        return self.realizar_pago(deuda, monto_pago)

    def perform_create(self, serializer):
        serializer.save()
        
    def realizar_pago(self, deuda, monto_pago):
        if deuda.Estado:
            return Response({'mensaje': 'La deuda ya ha sido pagada.'}, status=status.HTTP_400_BAD_REQUEST)

        if monto_pago != deuda.CantidadDeuda:
            return Response({'mensaje': 'El monto del pago no es igual a la cantidad de la deuda.'}, status=status.HTTP_400_BAD_REQUEST)

        serializer = tbPagosAlumnoSerializer(data={
            'FKCodigoDeuda': deuda.CodigoDeuda, 
            'MontoPago': monto_pago
        })

        if serializer.is_valid():
            serializer.save()
            deuda.Estado = True
            deuda.save()
            component = ConcreteComponent(serializer.instance)
            receipt_decorator = PdfReceiptDecorator(component)
            response_data = {'mensaje': component.operation(), 'recibo': receipt_decorator.operation()}
            return Response(response_data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)