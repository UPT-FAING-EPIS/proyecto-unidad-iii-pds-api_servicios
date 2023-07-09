[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/hobgdplm)
[![Open in Visual Studio Code](https://classroom.github.com/assets/open-in-vscode-718a45dd9cf7e7f842a935f5ebbe5719a5e09af4491e668f4dbf3b35d5cca122.svg)](https://classroom.github.com/online_ide?assignment_repo_id=10877193&assignment_repo_type=AssignmentRepo)

# SERVICIO BANCARIO

## OBJETIVOS
  * Crear un API para servicio Bancario (Agua, Luz, Educacion, Intenet y Telefonia)
  * Implementar 5 patrones de diseño
  * Implementar un Intefaz para cada servicio

## REQUERIMIENTOS
  * Conocimientos: 
    - Conocimientos básicos de Python (usando el framework de Django).
    - Conocimientos básicos de React.
    - Conociminetos básicos sobre patrones de diseño
  * Hardware:
    - Virtualization activada en el BIOS..
    - CPU SLAT-capable feature.
    - Al menos 4GB de RAM.
  * Software:
    - Windows 10 64bit: Pro, Enterprise o Education (1607 Anniversary Update, Build 14393 o Superior)
    - Docker Desktop 
    - Powershell versión 7.x
    - Visual Studio Code
    - Python
    - Framework Django
    - Framework React
    - Rabbitmq  

## CONSIDERACIONES INICIALES
  * Clonar el repositorio mediante git para tener los recursos necesarios

## DESARROLLO

### PARTE I: Creción de un API en Python (Django) para cada servicio

Primero ejecutamos el archivo requirements.txt para instalar los paquetes necesarios.
```
pip install -r requirements.txt
```
#### 1. Crear una API para el servicio de Agua

1.1. Para comenzar, implementaremos la funcionalidad de pago de facturas de agua a través de nuestra API. Utilizaremos el framework Django REST para desarrollar nuestras vistas y modelos. A continuación, se muestra un ejemplo de la implementación de la API de servicio de agua:
> views.py
```python

from rest_framework.generics import ListCreateAPIView
from api_recibos_agua import serializers, scraping, models
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from api_recibos_agua import models

class DeudaViews(APIView):

    def get(self, request, *args, **kwargs):
        codigo_cliente = request.GET.get('codigo_cliente')
        if not codigo_cliente:
            return Response({"error": "El parámetro 'codigo_cliente' es obligatorio."}, status=status.HTTP_400_BAD_REQUEST)

        correo = "apiagua@gmail.com"
        dni = "87654321"
        url = "https://pagovisa.epstacna.com.pe:8443"

        deuda = scraping.obtener_deuda(url, codigo_cliente, correo, dni)

        if deuda is not None:
            recibo_agua = models.ReciboAgua(
                cliente=codigo_cliente,
                fecha_emision="",
                fecha_vencimiento="",
                monto=deuda,
                pagado=False
            )
            recibo_agua.save()

            return Response({"deuda": deuda})
        else:
            return Response({"error": "No se encontró información de deuda para el cliente."})

    def post(self, request, *args, **kwargs):
        return Response({"error": "Método no permitido."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def put(self, request, *args, **kwargs):
        return Response({"error": "Método no permitido."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def delete(self, request, *args, **kwargs):
        return Response({"error": "Método no permitido."}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


class PagosViews(ListCreateAPIView):
    queryset = models.ReciboAgua.objects.all()
    serializer_class = serializers.ReciboAguaSerializer
```
1.2. En nuestra aplicación de servicio bancario, necesitamos un modelo de datos que represente los recibos de agua de nuestros clientes. Para ello, crearemos un archivo models.py y definiremos el siguiente modelo:
> models.py
```python
from django.db import models

class ReciboAgua(models.Model):
    cliente = models.CharField(max_length=200)
    fecha_emision = models.DateField()
    fecha_vencimiento = models.DateField()
    monto = models.DecimalField(max_digits=8, decimal_places=2)
    pagado = models.BooleanField(default=False)

    def __str__(self):
        return self.cliente
```
1.3. A continuación, necesitamos configurar las URL de nuestra API para que los usuarios puedan acceder a los diferentes recursos. Para ello, crearemos un archivo urls.py y agregaremos las siguientes rutas:
> urls.py
```python
from django.urls import path, include
from rest_framework import routers
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from api_recibos_agua import views

urlpatterns = [
    path('deuda/', views.DeudaViews.as_view(), name='get_deuda'),  
    path('pagos/', views.PagosViews.as_view(), name='pagos_alumno'),
]
```
1.4. Los serializadores nos permiten convertir los objetos de Django en formatos legibles por la API, como JSON. En nuestro caso, crearemos un archivo serializers.py y definiremos el siguiente serializador:
> serializers.py
```python
from rest_framework import serializers
from .models import ReciboAgua

class ReciboAguaSerializer(serializers.ModelSerializer):
    class Meta:
        model = ReciboAgua
        fields = '__all__'
```

#### 2. Creación de la API de servicio de teléfono

2.1. Continuando con nuestro proyecto de servicio bancario, agregaremos la funcionalidad de pago de facturas de teléfono a través de nuestra API. Utilizaremos el framework Django REST y aprovecharemos las características de las vistas basadas en modelos. A continuación, se muestra la implementación de la API de servicio de teléfono:

> views.py
```python
from rest_framework.viewsets import ModelViewSet
from rest_framework import status
from rest_framework.decorators import action
from post.models import Cliente, RegistroLlamadas, Plan, Factura
from post.api.serializers import ClienteSerializer, RegistroLlamadasSerializer, PlanSerializer, FacturaSerializer
from datetime import date, timedelta
from Patrones.observers import PatterObserverPagos, RabbitObserver
from Patrones.factory import DeudInterPagoFactory

pattern_observer = PatterObserverPagos()

class ClienteViewSet(ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer

    @action(detail=True, methods=['put'])
    def cancelar_servicio(self, request, pk=None):
        cliente = self.get_object()
        cliente.servicio_activo = False
        cliente.save()
        serializer = self.serializer_class(cliente)
        return Response({'status': 'OK', 'message': 'Servicio cancelado correctamente.'})

    def update(self, request, pk=None):
        cliente = self.get_object()
        serializer = ClienteSerializer(cliente, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RegistroLlamadasViewSet(ModelViewSet):
    queryset = RegistroLlamadas.objects.all()
    serializer_class = RegistroLlamadasSerializer

class PlanViewSet(ModelViewSet):
    queryset = Plan.objects.all()
    serializer_class = PlanSerializer

    def update(self, request, pk=None):
        plan = self.get_object()
        serializer = PlanSerializer(plan, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FacturaViewSet(ModelViewSet):
    queryset = Factura.objects.all()
    serializer_class = FacturaSerializer

    def update(self, request, pk=None):
        factura = self.get_object()
        serializer = FacturaSerializer(factura, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        factura = self.get_object()
        factura.delete()
        return Response({'status': 'OK', 'message': 'Factura eliminada correctamente.'})

    lookup_field = 'CodigoDeudInter'

    @action(detail=False, methods=['post'])
    def activar_plan(self, request):
        cliente_id = request.data.get('cliente_id')
        plan_id = request.data.get('plan_id')
        monto_pago = request.data.get('monto_pago')

        try:
            cliente = Cliente.objects.get(pk=cliente_id)
            plan = Plan.objects.get(pk=plan_id)
        except (Cliente.DoesNotExist, Plan.DoesNotExist):
            return Response({'mensaje': 'Cliente o plan no encontrado.'}, status=status.HTTP_400_BAD_REQUEST)

        if monto_pago != plan.costo_mensual:
            return Response({'mensaje': 'El monto del pago no coincide con el costo mensual del plan.'}, status=status
```
2.2. Comenzaremos diseñando nuestra base de datos utilizando los modelos de Django. En estos modelos, hemos definido las clases Cliente, RegistroLlamadas, Plan y Factura, que representan las entidades principales de nuestro servicio bancario. Cada clase define varios campos que almacenarán la información relevante para cada entidad. Además, hemos definido los métodos __str__ para representar los objetos de manera legible.
> models.py
```python
from django.db import models
import datetime

class Cliente(models.Model):
    nombre = models.CharField(max_length=100)
    direccion = models.CharField(max_length=200, default='Desconocido')
    telefono = models.CharField(max_length=20)
    cuenta_bancaria = models.CharField(max_length=20)
    servicio_activo = models.BooleanField(default=True) 

    def __str__(self):
        return self.nombre

class RegistroLlamadas(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    fecha_hora = models.DateTimeField(auto_now_add=True)
    duracion = models.PositiveIntegerField()

class Plan(models.Model):
    nombre = models.CharField(max_length=100)
    costo_mensual = models.DecimalField(max_digits=10, decimal_places=2)
    minutos_incluidos = models.IntegerField()
    datos_incluidos = models.IntegerField()

    def __str__(self):
        return self.nombre

class Factura(models.Model):
    cliente = models.ForeignKey(Cliente, on_delete=models.CASCADE)
    plan = models.ForeignKey(Plan, on_delete=models.CASCADE)
    monto = models.DecimalField(max_digits=10, decimal_places=2)
    fecha_emision = models.DateField()
    fecha_vencimiento = models.DateField(default=datetime.date.today() + datetime.timedelta(days=30))
    pagado = models.BooleanField(default=False)
    estado = models.BooleanField(default=True)

    def __str__(self):
        return f"Factura para {self.cliente} en {self.fecha_emision}"

```
2.3. Para poder acceder a nuestra API, necesitamos configurar las URL correspondientes. Aquí hemos creado un enrutador DefaultRouter que nos permitirá acceder a las vistas correspondientes a través de las URLs definidas. Registramos las vistas de RegistroLlamadasViewSet, ClienteViewSet, PlanViewSet y FacturaViewSet en el enrutador para que estén disponibles a través de las rutas especificadas.
> urls.py
```python
from django.urls import path, include
from rest_framework import routers
from rest_framework.routers import DefaultRouter
from .api.views import RegistroLlamadasViewSet, ClienteViewSet, PlanViewSet, FacturaViewSet

router_posts = DefaultRouter()
router_posts.register('registrollamadas', RegistroLlamadasViewSet)
router_posts.register('clientes', ClienteViewSet)
router_posts.register('planes', PlanViewSet)
router_posts.register('facturas', FacturaViewSet)

urlpatterns = [
    path('', include(router_posts.urls)),
]
```
2.4. Los serializadores nos permiten convertir los objetos de Django en formatos como JSON, que son más adecuados para la comunicación a través de una API. Aquí hemos definido los serializadores para cada modelo, especificando el modelo correspondiente y los campos que deseamos incluir en la serialización. El uso de fields = '__all__' nos permite incluir todos los campos del modelo en el serializador.

> serializers.py
```python
from django.urls import path, include
from rest_framework import routers
from rest_framework.routers import DefaultRouter
from .api.views import RegistroLlamadasViewSet, ClienteViewSet, PlanViewSet, FacturaViewSet

router_posts = DefaultRouter()
router_posts.register('registrollamadas', RegistroLlamadasViewSet)
router_posts.register('clientes', ClienteViewSet)
router_posts.register('planes', PlanViewSet)
router_posts.register('facturas', FacturaViewSet)

urlpatterns = [
    path('', include(router_posts.urls)),
]
```


#### 3. Creación de la API de servicio de educación

3.1. En nuestro proyecto de servicio bancario, también incluiremos la funcionalidad de pago de deudas de educación a través de nuestra API. Utilizaremos el framework Django REST y aprovecharemos las vistas basadas en conjuntos. A continuación, se muestra un ejemplo de la implementación de la API de servicio de educación:

> views.py
```python
from rest_framework.exceptions import NotFound
from rest_framework import status, viewsets, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import tbAlumno, tbDeudasAlumno, tbPagosAlumno
from .serializers import tbDeudasAlumnoSerializer, tbPagosAlumnoSerializer

class DeudasAlumnoViews(viewsets.ModelViewSet):
    queryset = tbDeudasAlumno.objects.all()
    serializer_class = tbDeudasAlumnoSerializer
    permission_classes = [permissions.AllowAny]

    def search_by_dni(self, dni):
        queryset = self.queryset.filter(fkCodigoAlumno=dni)
        serializer = self.serializer_class(queryset, many=True)
        return Response(serializer.data)

class PagosAlumnoViews(viewsets.ModelViewSet):
    queryset = tbPagosAlumno.objects.all()
    serializer_class = tbPagosAlumnoSerializer
    permission_classes = [permissions.AllowAny]


class BuscarDeudores(APIView):
    def get(self, request, fk_codigo_alumno):
        alumno = tbAlumno.objects.filter(CodigoAlumno=fk_codigo_alumno).first()

        if not alumno:
            raise NotFound('Alumno no encontrado')

        deudas = tbDeudasAlumno.objects.filter(fkCodigoAlumno__CodigoAlumno=fk_codigo_alumno)
        serializer = tbDeudasAlumnoSerializer(deudas, many=True)

        response_data = []
        for deuda in serializer.data:
            if deuda['Estado'] == 0:
                deuda['Situacion'] = 'Pendiente'
            else:
                deuda['Situacion'] = 'Pagado'
            response_data.append(deuda)

        return Response(response_data)
```
3.2.	Acontinuaciom, hemos definido cuatro clases de modelo: tbAlumno, tbCuenta, tbDeudasAlumno y tbPagosAlumno. Estas clases representan entidades como alumnos, cuentas, deudas y pagos en nuestro servicio bancario. En el archivo models.py de la aplicación api, agregue las siguientes clases:
> models.py
```python
from django.db import models
from datetime import date

class tbAlumno(models.Model):
    CodigoAlumno = models.CharField(max_length=255, primary_key=True)
    Nombre = models.CharField(max_length=255)
    Apellido = models.CharField(max_length=255)
    Email = models.CharField(max_length=255)

    class Meta:
        db_table = "tbAlumno"
        
class tbCuenta(models.Model):
    CodigoCuenta = models.CharField(max_length=255, primary_key=True)
    fkCodigoAlumno = models.ForeignKey(tbAlumno, on_delete=models.CASCADE)
    Monto = models.DecimalField(max_digits=10, decimal_places=2)
    Divisa = models.CharField(max_length=255)

    class Meta:
        db_table = "tbCuenta"
        
class tbDeudasAlumno(models.Model):
    CodigoDeuda = models.AutoField(primary_key=True)
    fkCodigoAlumno = models.ForeignKey(tbAlumno, on_delete=models.CASCADE)
    CantidadDeuda = models.DecimalField(max_digits=10, decimal_places=2)
    FechaVencimiento = models.DateField()
    Estado = models.BooleanField(default=False)
    
    class Meta:
        db_table = "tbDeudasAlumno"

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.observers = []

    def add_observer(self, observer):
        self.observers.append(observer)

    def notify_observers(self):
        for observer in self.observers:
            observer.update(self)
            
class tbPagosAlumno(models.Model):
    CodigoPago = models.AutoField(primary_key=True)
    FKCodigoDeuda = models.ForeignKey(tbDeudasAlumno, on_delete=models.CASCADE)
    MontoPago = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    FechaPago = models.DateField(default=date.today)

    class Meta:
        db_table = "tbPagosAlumno"

```
3.3.	Para acceder a nuestra API y realizar diversas acciones bancarias, debemos configurar las URL adecuadamente. En el archivo urls.py de la aplicación api, agregue el siguiente código:

> urls.py
```python
from django.urls import path, include
from rest_framework import routers
from .views import DeudasAlumnoViews, BuscarDeudores, PagosAlumnoViews
from .pagardecorator import RealizarPagoViews
from .pagodebito import PagoDebitoViews

router = routers.DefaultRouter()
router.register('deudas', DeudasAlumnoViews)
router.register('pagos', PagosAlumnoViews)

urlpatterns = [
    path('', include(router.urls)),
    path('pagar/', RealizarPagoViews.as_view(), name='realizar_pago'),
    path('pagarDebito/', PagoDebitoViews.as_view(), name='realizar_pago2'),
    path('listardeudores/<str:fk_codigo_alumno>/', BuscarDeudores.as_view(), name='listar_deudores'),
]
```
3.4.	En el código, hemos definido tres clases de serializadores para nuestros modelos: tbAlumnoSerializer, tbDeudasAlumnoSerializer y tbPagosAlumnoSerializer. Estos serializadores especifican qué campos del modelo deben ser incluidos en la respuesta JSON de nuestra API:

> serializers.py
```python
from rest_framework import serializers
from .models import tbAlumno, tbDeudasAlumno, tbPagosAlumno

class tbAlumnoSerializer(serializers.ModelSerializer):
    class Meta:
        model = tbAlumno
        fields = '__all__'

class tbDeudasAlumnoSerializer(serializers.ModelSerializer):
    fkCodigoAlumno = serializers.PrimaryKeyRelatedField(queryset=tbAlumno.objects.all())

    class Meta:
        model = tbDeudasAlumno
        fields = '__all__'

class tbPagosAlumnoSerializer(serializers.ModelSerializer):
    FKCodigoDeuda = serializers.PrimaryKeyRelatedField(queryset=tbDeudasAlumno.objects.all())

    class Meta:
        model = tbPagosAlumno
        fields = '__all__'
```

#### 4. Creación de la API de servicio de internet

4.1. Finalmente, agregaremos la funcionalidad de pago de facturas de internet a través de nuestra API de servicio bancario. Utilizaremos el framework Django REST y aprovecharemos las vistas basadas en clases genéricas. A continuación, se muestra un ejemplo de la implementación de la API de servicio de internet:

> views.py
```python
from rest_framework import generics, viewsets
from rest_framework.response import Response
from .models import CuentDeudInter
from .serializers import DeudInterSerializer, DeudInterSerializer2
from datetime import datetime
from decimal import Decimal
from Patrones.factory import DeudInterPagoFactory

class DeudInterListView(viewsets.ModelViewSet):
    serializer_class = DeudInterSerializer
    queryset = CuentDeudInter.objects.all()

class DeudInterPagoView(generics.RetrieveUpdateAPIView):
    queryset = CuentDeudInter.objects.all()
    serializer_class = DeudInterSerializer2

    lookup_field = 'CodigoDeudInter'
    http_method_names = ['get', 'patch']

    def patch(self, request, *args, **kwargs):
        pago = Decimal(request.data.get('MonPago'))

        if not pago:
            return Response({'error': 'Falta el valor en Monto Pago'}, status=status.HTTP_400_BAD_REQUEST)

        deud_inter = self.get_object()
        command = DeudInterPagoFactory.create("ServicioInternet", pago)
        result = command.pagar(deud_inter)

        if result['status'] == 200:
            serializer = self.get_serializer(deud_inter)
            response_data = {
                'mensaje': result['mensaje'], 'data': serializer.data
            }
        else:
            response_data = {'mensaje': result['mensaje']}

        return Response(response_data, status=result['status'])
```
4.2.	En este modelo, hemos definido los campos necesarios para representar una cuenta deudora de un servicio bancario. El campo CodigoDeudInter es una clave primaria que identifica de manera única cada cuenta. Además, tenemos campos como Nombre, Apellido, MonDeuda, MonPago, FechVenc y Estado para almacenar información relevante. En el archivo "models.py", incluimos el siguiente código:
> models.py
```python
from django.db import models

class CuentDeudInter(models.Model):
    CodigoDeudInter = models.IntegerField(primary_key=True)
    Nombre = models.CharField(max_length=255)
    Apellido = models.CharField(max_length=255)
    MonDeuda = models.DecimalField(max_digits=10, decimal_places=2)
    MonPago = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    FechVenc = models.DateField()
    Estado = models.BooleanField(default=True)

    class Meta:
        db_table = "tbCuentaDeudInter"
```
4.3.	La configuración de las URL nos permite definir cómo se accede a nuestra API a través de diferentes endpoints. En el archivo "urls.py", agregamos el siguiente código:
> urls.py
```python
from django.urls import path, include
from .views import DeudInterListView, DeudInterPagoView
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'Deudores', DeudInterListView, 'Deudores')

urlpatterns = [
    path('', include(router.urls)),
    path('pagoInter/<int:CodigoDeudInter>/', DeudInterPagoView.as_view(), name='Internet-detail')
]
```
4.4.	En este código, hemos definido dos serializadores. El serializador DeudInterSerializer se utiliza para mostrar todos los campos del modelo CuentDeudInter, mientras que DeudInterSerializer2 muestra solo algunos campos específicos. Además, hemos establecido los campos Estado y MonPago como solo lectura.
> urls.py
```python
from rest_framework import serializers
from .models import CuentDeudInter

class DeudInterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CuentDeudInter
        fields = '__all__'
        read_only_fields = ('Estado', 'MonPago')

class DeudInterSerializer2(serializers.ModelSerializer):
    class Meta:
        model = CuentDeudInter
        fields = ('CodigoDeudInter', 'MonDeuda', 'MonPago')
        read_only_fields = ['MonDeuda']
```

#### 5. Creación de la API de servicio de luz

5.1. Para completar nuestro proyecto de servicio bancario, implementaremos la funcionalidad de pago de facturas de luz a través de nuestra API. Utilizaremos el framework Django REST y aprovecharemos las vistas basadas en clases genéricas. A continuación, se muestra un ejemplo de la implementación de la API de servicio de luz:

> views.py
```python
from rest_framework import generics
from rest_framework.response import Response
from .models import TbDeuda, TbPagos
from .serializers import DeudaSerializer, PagosSerializer
from rest_framework.generics import RetrieveAPIView, UpdateAPIView, DestroyAPIView
from Patrones.factory import DeudInterPagoFactory
from datetime import datetime

class DeudaDTO:
    def __init__(self, codigo_deuda, fk_codigocliente, fecha_vencimiento_pago, monto, estado):
        self.codigo_deuda = codigo_deuda
        self.fk_codigocliente = fk_codigocliente
        self.fecha_vencimiento_pago = fecha_vencimiento_pago.strftime('%Y-%m-%d')
        self.monto = monto
        self.estado =estado

    def to_dict(self):
        return {
            'codigo_deuda': self.codigo_deuda,
            'fk_codigocliente': self.fk_codigocliente,
            'fecha_vencimiento_pago': self.fecha_vencimiento_pago,
            'monto': self.monto,
            'estado': self.estado
        }


class PagoDTO:
    def __init__(self, codigo_pago, codigo_deuda, pago, fecha_pago):
        self.codigo_pago = codigo_pago
        self.codigo_deuda = codigo_deuda
        self.monto_pago = pago
        self.fecha_pago = fecha_pago.strftime('%Y-%m-%d')

    def to_dict(self):
        return {
            'codigo_pago': self.codigo_pago,
            'codigo_deuda': self.codigo_deuda,
            'monto_pago': self.monto_pago,
            'fecha_pago': self.fecha_pago
        }


class DeudaDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TbDeuda.objects.all()
    serializer_class = DeudaSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        deuda_dto = self.to_deuda_dto(instance)
        return Response(deuda_dto.to_dict())

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        deuda_dto = self.to_deuda_dto(instance)
        return Response(deuda_dto.to_dict())

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'mensaje': 'Deuda eliminada correctamente'})

    def to_deuda_dto(self, deuda):
        return DeudaDTO(
            codigo_deuda=deuda.CodigoDeuda,
            fk_codigocliente=deuda.FkCodigoCliente_id,
            fecha_vencimiento_pago=deuda.FechaVencimientoPago,
            monto=deuda.Monto,
            estado=deuda.Estado
        )


class PagoDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = TbPagos.objects.all()
    serializer_class = PagosSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        pago_dto = self.to_pago_dto(instance)
        return Response(pago_dto.to_dict())

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)

        pago_dto = self.to_pago_dto(instance)
        return Response(pago_dto.to_dict())

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response({'mensaje': 'Pago eliminado correctamente'})

    def to_pago_dto(self, pago):
        return PagoDTO(
            codigo_pago=pago.CodigoPago,
            codigo_deuda=pago.CodigoDeuda_id,
            pago=pago.Pago,
            fecha_pago=pago.FechaPago
        )


class DeudaListView(generics.ListCreateAPIView):
    queryset = TbDeuda.objects.all()
    serializer_class = DeudaSerializer


class PagoListView(generics.ListCreateAPIView):
    queryset = TbPagos.objects.all()
    serializer_class = PagosSerializer

    def post(self, request, *args, **kwargs):
        codigo_deuda = request.data.get('CodigoDeuda', None)
        codigo_pago = request.data.get('CodigoPago', None)

        if codigo_deuda is None:
            return Response({'error': 'El campo CodigoDeuda es requerido.'}, status=400)

        deuda = TbDeuda.objects.filter(CodigoDeuda=codigo_deuda).first()

        if deuda is None:
            return Response({'error': f'La deuda con CodigoDeuda={codigo_deuda} no existe.'}, status=400)

        monto_pago = float(request.data.get('Pago', 0))
        fecha_pago_str = request.data.get('FechaPago', datetime.now())
        fecha_pago = datetime.strptime(fecha_pago_str, '%Y-%m-%d').date()

        if deuda.FechaVencimientoPago != fecha_pago:
            deuda.Monto += 80
            deuda.save()
            return Response({'mensaje': 'La fecha de pago y vencimiento no coinciden. Se agregaron S/80 a la deuda.'})

        if monto_pago != deuda.Monto:
            return Response({'error': 'El monto de pago no coincide con la deuda. Se interrumpe la operación.'},
                            status=400)

        pago = TbPagos(CodigoPago=codigo_pago, CodigoDeuda=deuda, Pago=monto_pago, FechaPago=fecha_pago)
        pago.save()
        deuda.Estado = 'pagado'
        deuda.save()

        command = DeudInterPagoFactory.create("ServicioLuz", pago.Pago)

        result = command.pagar(deuda)

        serializer = self.get_serializer(pago)
        response_data = {'mensaje': result['mensaje'], 'data': serializer.data}
        return Response(response_data, status=result['status'])
```
5.2. En este código, hemos definido tres modelos: TbClientes, TbDeuda y TbPagos. Estos modelos representan los clientes, las deudas y los pagos respectivamente. Cada modelo contiene una serie de campos que se utilizarán para almacenar la información relevante. Abre el archivo models.py y agrega las siguientes clases:

> models.py
```python
from django.db import models

class TbClientes(models.Model):
    CodigoCliente = models.CharField(max_length=255, primary_key=True)
    Nombre = models.CharField(max_length=255)
    Apellido = models.CharField(max_length=255)
    Direccion = models.CharField(max_length=255)
    Ciudad = models.CharField(max_length=255)
    Telefono = models.IntegerField()

    class Meta:
        db_table = "TbClientes"

class TbDeuda(models.Model):
    CodigoDeuda = models.CharField(max_length=255, primary_key=True)
    FkCodigoCliente = models.ForeignKey(TbClientes, on_delete=models.CASCADE)
    FechaVencimientoPago = models.DateField()
    Monto = models.DecimalField(max_digits=10, decimal_places=2)
    Estado = models.CharField(max_length=255)

    class Meta:
        db_table = "TbDeuda"


class TbPagos(models.Model):
    CodigoPago = models.CharField(max_length=255, primary_key=True)
    CodigoDeuda = models.ForeignKey(TbDeuda, on_delete=models.CASCADE)
    Pago = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    FechaPago = models.DateField()

    class Meta:
        db_table = "TbPagos"
```
5.3.	Para acceder a los datos a través de una API, necesitamos definir las vistas correspondientes y las rutas URL asociadas. Abre el archivo urls.py y reemplaza su contenido con el siguiente código:
> urls.py
```python
from django.db import models

class TbClientes(models.Model):
    CodigoCliente = models.CharField(max_length=255, primary_key=True)
    Nombre = models.CharField(max_length=255)
    Apellido = models.CharField(max_length=255)
    Direccion = models.CharField(max_length=255)
    Ciudad = models.CharField(max_length=255)
    Telefono = models.IntegerField()

    class Meta:
        db_table = "TbClientes"

class TbDeuda(models.Model):
    CodigoDeuda = models.CharField(max_length=255, primary_key=True)
    FkCodigoCliente = models.ForeignKey(TbClientes, on_delete=models.CASCADE)
    FechaVencimientoPago = models.DateField()
    Monto = models.DecimalField(max_digits=10, decimal_places=2)
    Estado = models.CharField(max_length=255)

    class Meta:
        db_table = "TbDeuda"


class TbPagos(models.Model):
    CodigoPago = models.CharField(max_length=255, primary_key=True)
    CodigoDeuda = models.ForeignKey(TbDeuda, on_delete=models.CASCADE)
    Pago = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    FechaPago = models.DateField()

    class Meta:
        db_table = "TbPagos"
```
5.4.	Las vistas son responsables de manejar las solicitudes y las respuestas HTTP en nuestra API. Los serializadores, por otro lado, se encargan de convertir los objetos de Django en representaciones legibles para la API. Abre el archivo serializers.py y agrega el siguiente código:
> serializers.py
```python
from django.db import models

class TbClientes(models.Model):
    CodigoCliente = models.CharField(max_length=255, primary_key=True)
    Nombre = models.CharField(max_length=255)
    Apellido = models.CharField(max_length=255)
    Direccion = models.CharField(max_length=255)
    Ciudad = models.CharField(max_length=255)
    Telefono = models.IntegerField()

    class Meta:
        db_table = "TbClientes"

class TbDeuda(models.Model):
    CodigoDeuda = models.CharField(max_length=255, primary_key=True)
    FkCodigoCliente = models.ForeignKey(TbClientes, on_delete=models.CASCADE)
    FechaVencimientoPago = models.DateField()
    Monto = models.DecimalField(max_digits=10, decimal_places=2)
    Estado = models.CharField(max_length=255)

    class Meta:
        db_table = "TbDeuda"


class TbPagos(models.Model):
    CodigoPago = models.CharField(max_length=255, primary_key=True)
    CodigoDeuda = models.ForeignKey(TbDeuda, on_delete=models.CASCADE)
    Pago = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    FechaPago = models.DateField()

    class Meta:
        db_table = "TbPagos"
```
### PARTE II: Implementacion de 5 Patrones de Diseño 
#### 1. Patron de diseño Factory
1.1.	Para implementar nuestros servicios bancarios utilizando patrones de diseño Factory, comenzamos definiendo una interfaz IServicio que contiene un método común llamado pagar(). Cada tipo de servicio (internet, agua, teléfono, educación y luz) implementará esta interfaz y proporcionará su propia lógica de pago. A continuación, presentamos algunas de las implementaciones de los servicios bancarios utilizando el patrón Factory:

> Servicio de Internet
```python
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

        deud_inter.save()
        
        if datetime.date.today() > deud_inter.FechVenc:
            return {'mensaje': f'Pago Realizado, con Interes de 20% siendo un total de: {deud_inter_pago}', 'status': 200}
        else:
            return {'mensaje': 'Pago Realizado Total', 'status': 200}
```
> Servicio de Educación
```python
class ServicioEducacion(IServicio):
    def __init__(self, pago):
        _pago=pago
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
        observerPagos.notify_observers('Pago realizado exitosamente. Monto final: {}'.format(monto_pago_final),"ServicioEducacion")
        return Response({'mensaje': 'Pago realizado exitosamente. Monto final: {}'.format(monto_pago_final)}, status=status.HTTP_200_OK)
```
> Servicio de Luz
```python
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

        deud_luz.Monto = Decimal(deud_luz_pago) - self._pago  # Utilizar self._pago directamente

        if deud_luz.Monto != 0:
            return {'mensaje': 'El pago no es el debido', 'status': 400}

        observerPago.notify_observers("Pago Realizado", "ServicioLuz")

        deud_luz.save()

        if datetime.date.today() > deud_luz.FechaVencimientoPago:
            return {'mensaje': f'Pago Realizado, con interés de 20% siendo un total de: {deud_luz_pago}',
                    'status': 200}
        else:
            return {'mensaje': 'Pago Realizado Total', 'status': 200}
```
> Servicio de Telefonía
```python
class ServicioTelefonia(IServicio):
    def __init__(self, cliente_id, plan_id, monto_pago):
        self.cliente_id = cliente_id
        self.plan_id = plan_id
        self.monto_pago = Decimal(monto_pago)

    def pagar(self):
        cliente = Cliente.objects.get(pk=self.cliente_id)
        plan = Plan.objects.get(pk=self.plan_id)

        if self.monto_pago != plan.costo_mensual:
            return {'mensaje': 'El monto del pago no coincide con el costo mensual del plan.',
                    'status': status.HTTP_400_BAD_REQUEST}

        fecha_emision = date.today()
        fecha_vencimiento = fecha_emision + timedelta(days=30)

        factura = Factura.objects.create(
            cliente=cliente,
            plan=plan,
            monto=self.monto_pago,
            fecha_emision=fecha_emision,
            fecha_vencimiento=fecha_vencimiento,
            pagado=True,
            estado=True
        )
        observerPagos= PatterObserverPagos()

        observer = RabbitObserver()
        observerPagos.attach_observer(observer)
        observerPagos.notify_observers('Nueva factura creada', 'factura Pagada')

        return {'mensaje': 'Plan activado y factura creada correctamente.',
                'status': status.HTTP_201_CREATED}
```
1.2.	Factory para pagos de deudas
> Además de los diferentes servicios, también implementamos una clase DeudInterPagoFactory que actúa como un Factory para crear instancias de los servicios de pago de deudas. Esta clase nos permite crear servicios de pago específicos según el nombre del servicio proporcionado.
```python
class DeudInterPagoFactory:
    def create(nameservicio,pagar):
        if (nameservicio=="ServicioInternet"):
            return ServicioInternet(pagar)

        if (nameservicio=="ServicioEducacion"):
            return ServicioEducacion(pagar)
            
        if (nameservicio == "ServicioLuz"):
            return ServicioLuz(pagar)

    @staticmethod
    def createTelefono(nameservicio, cliente_id, plan_id, monto_pago):
        if nameservicio == "ServicioTelefonia":
            return ServicioTelefonia(cliente_id, plan_id, monto_pago)
        else:
            raise ValueError('Tipo de servicio no válido')

```
#### 2. Patron de diseño Money
2.1.	Ahora, veamos cómo podemos utilizar el patrón de diseño Money en un servicio bancario que ofrece diferentes servicios. Supongamos que tenemos un modelo de datos con diferentes deudas asociadas a cada servicio. Podemos utilizar la clase Money para manejar los pagos y las conversiones monetarias de la siguiente manera:
> money.py
```python
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
```
#### 3. Patron de diseño Observer
3.1.	Para implementar el patrón Observer en nuestra API de servicio bancario, comenzamos definiendo las clases necesarias. A continuación se muestra una implementación básica de las clases PatterObserverPagos, Observer y RabbitObserver:
> observer.py
```python
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

    def notify_observers(self, message, rooting_key):
        for observer in self._observers:
            observer.update(message, rooting_key)

class Observer:
    def update(self, message, rooting_key):
        pass

class RabbitObserver(Observer):
    def update(self, message, rooting_key):
        RabbitMq.rabbitmqMessage(message, rooting_key)
```
#### 4. Patron de diseño rabbitmq
4.1.	Para implementar el patrón de diseño RabbitMQ en nuestra API de servicio bancario, comenzamos definiendo la clase RabbitMq, que actuará como nuestro punto de entrada para enviar mensajes a la cola de RabbitMQ. A continuación se muestra una implementación básica de esta clase:
> rabbitMq.py
```python
import pika
import datetime
import json

rabbitmq_host = "amqps://enozynwv:2TtZL4ta8m_64qXMTbYs2SjVjRbPL8av@cow.rmq2.cloudamqp.com/enozynwv"
params = pika.URLParameters(rabbitmq_host)
connection = pika.BlockingConnection(params)

class RabbitMq():
    _instance = None
    
    def __new__(cls, *args, **kwargs):
        if not cls._instance:
            cls._instance = super().__new__(cls, *args, **kwargs)
        return cls._instance
    
    def rabbitmqMessage(message="error", routing_key="error"):
        log = {
            "timestamp": datetime.datetime.now().isoformat(),
            "Level": routing_key,
            "Message": json.dumps(message)
        }
        
        channel = connection.channel()
        channel.queue_declare(queue="logsPago")
        channel.basic_publish(
            exchange='', routing_key="logsPago", body=json.dumps(log)
        )
        connection.close()
```
#### 5. Patron de diseño Strategy
5.1.	Para implementar el patrón de diseño Strategy en nuestra API de servicio bancario, comenzamos definiendo una clase base PaymentStrategy que representa la interfaz común para todas las estrategias de pago. A continuación, implementamos dos clases concretas DiscountPaymentStrategy y InterestPaymentStrategy que representan las diferentes estrategias de pago. Aquí está la implementación básica de estas clases:
> strategy.py
```python
import datetime
from decimal import Decimal

class PaymentStrategy:
    def calculate_payment(self, amount, due_date):
        pass

class DiscountPaymentStrategy(PaymentStrategy):
    def calculate_payment(self, amount, due_date):
        return amount


class InterestPaymentStrategy(PaymentStrategy):
    def calculate_payment(self, amount, due_date):
        if datetime.date.today() > due_date:
            return amount * Decimal('1.2')  # Aplicar un incremento del 20% como interés
        else:
            return amount
```
### PARTE III: Creacion de Frontend con React + Django para cada servicio

