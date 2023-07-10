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
#### 1. Configuración del proyecto
1.1. Comenzamos configurando un nuevo proyecto de React utilizando herramientas como Create React App. Luego, configuramos un proyecto de Django y usamos las API ya creadas para cada servicio. Ejecuta el siguiente comando para crear un nuevo proyecto de React:
```lua
npx create-react-app Front
```
1.2. Inicia la aplicación de React ejecutando el siguiente comando:
```lua
npm start
```
#### 2. Creación de modelos:
2.1. Models Servicios Educacion
> educationservice.ty
```typescript
export type Deudor = {
  CodigoDeuda: number;
  fkCodigoAlumno: string;
  CantidadDeuda: string;
  FechaVencimiento: string;
  Estado: boolean;
  Situacion?: string;
};
export type Deuda = {
  CodigoDeuda: number;
  CodigoCuenta: number;
  MontoPago: number;
};
export type Pago = {
  CodigoPago: number;
  FKCodigoDeuda: number;
  MontoPago: string;
  FechaPago: string;
};

```
2.2. Models Servicios Internet
> internetservice.ty
```typescript
export type Deudor = {
  CodigoDeudInter: number;
  Nombre: string;
  Apellido: string;
  MonDeuda: number;
  FechVenc: Date;
  Estado: boolean;

};


export type Deuda = {
  CodigoDeudInter: number;
  MonPago: number;
};
```
2.3. Models Servicios luz
> luzservice.ty
```typescript
export interface Clientes {
    CodigoDeuda: string;
    FkCodigoCliente: string;
    Monto: number;
    FechaVencimientoPago: string; 
    Estado: string; 
    Situacion?:string;
  }
  
  export interface Deuda {
    codigo_deuda: string;
    FkCodigoCliente: string;
    FechaVencimientoPago: string; 
    Monto: number;
    Estado: string; 
  }
  
  export interface Pagos {
    CodigoPago: string;
    CodigoDeuda: number;
    Pago: number;
    FechaPago: string; 
  }
  
```
2.4. Models Servicios Telefonia
> telephonyservice.ty
```typescript
export type Factura = {
    id : number;
    cliente : number;
    plan : number;
    monto : number;
    fecha_emision : string;
    fecha_vencimiento : string;
    pagado: boolean;
    estado:boolean;
  };
  export type Llamadas = {
    id : number;
    fecha_hora: string;
    duracion: number;
    cliente_id : number;
  };
  export type Plan = {
    id : number;
    nombre : string;
    costo_mensual : number;
    minutos_incluidos : number;
    datos_incluidos : number;
  };
  export type Cliente = {
    id : number;
    nombre : string;
    direccion  : string;
    telefono  : string;
    cuenta_bancaria  : string;
    servicio_activo :boolean;
  };
```
#### 3. Conexión entre React y la API REST de Django:
3.1. Para conectar React con la API REST de Django, utilizaremos la biblioteca axios en React para realizar solicitudes HTTP a los endpoints de la API. Podemos definir funciones en React que hagan uso de axios para obtener y enviar datos a través de la API. Estas funciones se pueden llamar desde los componentes de React para interactuar con el backend y mostrar los datos en la interfaz de usuario.
> education.api.ts
```typescript
import axios from "axios";
import { Deuda } from "../Types/educationservice";

export const obtenerDeudores = () => {
  return axios.get("http://127.0.0.1:8000/ServicioEducacion/deudas/");
};

export const pagarDeuda = (pago: Deuda) => {
  return axios.post("http://127.0.0.1:8000/ServicioEducacion/pagarDebito/", pago);
};

export const buscarDeuda = (cod: number) => {
  return axios.get(`http://127.0.0.1:8000/ServicioEducacion/listardeudores/${cod}/`);
};
export const obtenerPagos = () => {
  return axios.get("http://127.0.0.1:8000/ServicioEducacion/pagos/");
};
```
> internet.api.ts
```typescript
import axios from "axios";
import { Deuda } from "../Types/internetservice";

export const obtenerDeudores = () => {
  return axios.get("http://127.0.0.1:8000/ServicioInternet/Deudores/");
};

export const buscarDeuda = (cod: number) => {
  return axios.get(`http://127.0.0.1:8000/ServicioInternet/Deudores/${cod}/`);
};

export const pagarDeuda = (cod:number,pago: Deuda) => {
  return axios.patch(`http://127.0.0.1:8000/ServicioInternet/pagoInter/${cod}/`, pago);
};
```
> luz.api.ts
```typescript
import axios from "axios";
import { Pagos } from "../Types/luzservice";


export const obtenerDeudores = () => {
  return axios.get("http://127.0.0.1:8000/ServicioLuz/deudas/");
};

export const pagarDeuda = (pagoData: Pagos) => {
  return axios.post("http://127.0.0.1:8000/ServicioLuz/pagos/", pagoData);
};

export const buscarDeuda = (cod: number) => {
  return axios.get(`http://127.0.0.1:8000/ServicioLuz/deudas/${cod}/`);
};
export const obtenerPagos = () => {
  return axios.get("http://127.0.0.1:8000/ServicioLuz/pagos/");
};
```
> Telephony.ts
```typescript
import axios from "axios";
import { Plan } from "../Types/telephonyservice";

export const obtenerplan = () => {
  return axios.get("http://127.0.0.1:8000/ServicioTelefonia/planes/");
};

export const elegirplan = (cliente_id: number, plan_id: number, monto_pago: number) => {
  console.log("Datos enviados:", cliente_id, plan_id, monto_pago);
  return axios.post("http://127.0.0.1:8000/ServicioTelefonia/facturas/activar_plan/", {
    cliente_id: cliente_id,
    plan_id: plan_id,
    monto_pago: monto_pago
  });
};

export const pagarDeuda = (plan: Plan) => {
    return axios.post("http://127.0.0.1:8000/ServicioTelefonia/planes/", plan);
};
  
export const buscarcliente = (id: number) => {
  return axios.get(`http://127.0.0.1:8000/ServicioTelefonia/clientes/${id}/`);
};

export const actualizarsaldo = (id: number,nombre: string, direccion: string, telefono: string, cuenta_bancaria: number, servicio_activo: number) => {
  return axios.put(`http://127.0.0.1:8000/ServicioTelefonia/clientes/${id}/`,{
    nombre: nombre,
    direccion: direccion,
    telefono: telefono,
    cuenta_bancaria: cuenta_bancaria,
    servicio_activo: servicio_activo
  });
};

export const obtenerfactura = () => {
  return axios.get("http://127.0.0.1:8000/ServicioTelefonia/facturas/");
};

export const obtenercliente = () => {
    return axios.get("http://127.0.0.1:8000/ServicioTelefonia/clientes/");
  };
```
#### 4. Creación de Router en React:
4.1. Primero configuramos el app.txs en la que se definira las rutas de cada servicio:
> app.txs
```javascript
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { MainServicesPages } from "./pages/MainServicesPages";
import { Navigation } from "./components/Navigation";
import { Toaster } from "react-hot-toast";
import { EducacionRoutes } from "./routes/EducacionRoutes";
import { InternetRoutes } from "./routes/InternetRoutes";
import { ClienteRoutes } from "./routes/ClienteRoutes";
import { TelephonyRoutes } from "./routes/TelephonyRoutes";
import { LuzRoutes } from "./routes/LuzRoutes";
import { InicioAgua } from "./pages/AguaService/InicioAgua";

function App() {
  return (
    <BrowserRouter>
      <div className="container mx-auto px-2">
        <Navigation />
        <Routes>
          <Route path="/" element={<Navigate to="/Servicios" />} />
          <Route path="/Servicios" element={<MainServicesPages />} />
          <Route path="/Servicios/Educacion/*" element={<EducacionRoutes />} />
          <Route path="/Servicios/Luz/*" element={<LuzRoutes/>} />
          <Route path="/Servicios/Internet/*" element={< InternetRoutes/>} />
          <Route path="/Servicios/Telefonia/*" element={<TelephonyRoutes/>} />
          <Route path="/Cliente/*" element={< ClienteRoutes/>} />
          <Route path="/Servicios/Agua/" element={< InicioAgua/>} />
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}

export default App;

```
4.2. luego creamos las subrutas de cada servicio:
> EducacionRoutes.txs
```javascript
import { Route, Routes } from "react-router-dom";
import { InicioEducation } from "../pages/EducationService/InicioEducacion";
import { Deudas } from "../pages/EducationService/Deudas";
import { Pagos } from "../pages/EducationService/Pagos";
import { BusquedaPago } from "../pages/EducationService/BusquedaPago";
import { PagarDeudas } from "../pages/EducationService/PagarDeudas";
import { RealizarPago } from "../pages/EducationService/RealizarPago";

export const EducacionRoutes = () => (
  <Routes>
    <Route path="/" element={<InicioEducation />} />
    <Route path="/Deudas" element={<Deudas />} />
    <Route path="/Pagos" element={<Pagos />} />
    <Route path="/Pagar" element={<PagarDeudas />} />
    <Route path="/RealizarPago" element={<RealizarPago />} />
    <Route path="/BusquedaPago" element={<BusquedaPago />} />
  </Routes>
);
```
> InternetRoutes.txs
```javascript
import { Route, Routes } from "react-router-dom";

import { InicioInternet } from "../pages/InternetService/InicioInternet";
import { DeudoresInternet } from "../pages/InternetService/DeudoresInternet";
import { BusquedaPagoInternet } from "../pages/InternetService/PagosInternet";
import { RealizarPagoInternet } from "../pages/InternetService/RealizarPago";


export const InternetRoutes = () => (
  <Routes>
    <Route path="/" element={<InicioInternet />} />
    <Route path="/Deudores" element={<DeudoresInternet />} />
    <Route path="/Pagar" element={<BusquedaPagoInternet />} />
    <Route path="/RealizarPago" element={<RealizarPagoInternet />} />
  </Routes>
);
```
> LuzRoutes.txs
```javascript
import { Route, Routes } from "react-router-dom";
import { InicioLuz } from "../pages/LuzService/InicioLuz";
import { DeudasLuz } from "../pages/LuzService/Deudas";
import { PagosLuz } from "../pages/LuzService/PagoLuz";
import { RealizarPago } from "../pages/LuzService/RealizarPago";


export const LuzRoutes = () => (
  <Routes>
    <Route path="/" element={<InicioLuz/>} />
    <Route path="/Deudas" element={<DeudasLuz />} />
    <Route path="/Pagos" element={<PagosLuz />} />
    <Route path="/RealizarPago" element={<RealizarPago />} />

  </Routes>
);
```
> TelephonyRoutes.txs
```javascript
import { Route, Routes } from "react-router-dom";
import { IndexService } from "../pages/TelephonyService/IndexService";
import { Facturas } from "../pages/TelephonyService/Facturas";
import { Planes } from "../pages/TelephonyService/Plan";
import { RealizarPago } from "../pages/TelephonyService/RealizarPago";

export const TelephonyRoutes = () => (
  <Routes>
    <Route path="/" element={<IndexService />} />
    <Route path="/Facturas" element={<Facturas />} />
    <Route path="/Planes" element={<Planes />} />
    <Route path="/RealizarPago" element={<RealizarPago />} />
  </Routes>
);
```
#### 5. Desarrollo de las vistas y funcionalidades del frontend:
#### En esta etapa, nos enfocaremos en desarrollar las vistas y funcionalidades específicas del frontend:
---
5.1. Sevicio Educacion 
> BusquedaPago.tsx
```javascript
import { useState } from "react";
import { useForm } from "react-hook-form";
import { buscarDeuda } from "../../api/education.api.ts";
import { Deudor } from "../../Types/educationservice.ts";
import { ContentTDeudas } from "../../components/EducationService/ContentTDeudas";
import { Regresar } from "../../components/Regresar.tsx";

export function BusquedaPago() {
  const [deudores, setDeudores] = useState<Deudor[]>([]);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    const codigoEstudiante = data.codigoEstudiante;

    try {
      const response = await buscarDeuda(parseInt(codigoEstudiante));
      setDeudores(response.data);
      setError("");
    } catch (error) {
      console.log(error);
      setDeudores([]);
      setError("Alumno no encontrado");
    }
  });

  return (
    <>
      <Regresar to="/Servicios/Educacion/Pagar" />
      <div className="mt-4">
        <form onSubmit={onSubmit}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              {...register("codigoEstudiante", { required: true })}
              className="block w-full p-4 pl-10 text-lg text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Ingrese el código del estudiante"
              required
            />
            {errors.codigoEstudiante && (
              <span className="text-red-500">
                Código de estudiante requerido
              </span>
            )}
            <button
              type="submit"
              className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          </div>
        </form>{" "}
        <div className="container mx-auto px-4 py-8">
          {error && <p className="text-red-500">{error}</p>}
          {deudores.length > 0 ? (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-300 dark:text-gray-300">
                <thead className="text-xs text-gray-600 uppercase dark:text-gray-300">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-gray-600">
                      Codigo de deuda
                    </th>
                    <th scope="col" className="px-6 py-3 text-gray-600">
                      Cantidad
                    </th>
                    <th scope="col" className="px-6 py-3 text-gray-600">
                      Vencimiento
                    </th>
                    <th scope="col" className="px-6 py-3 text-gray-600">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3 text-gray-600">
                      Codigo Estudiante
                    </th>
                    <th scope="col" className="px-6 py-3 text-gray-600">
                      Accion
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deudores.map((deudor) => (
                    <ContentTDeudas
                      key={deudor.CodigoDeuda}
                      codigoDeuda={deudor.CodigoDeuda.toString()}
                      cantidadDeuda={deudor.CantidadDeuda}
                      fechaVencimiento={deudor.FechaVencimiento}
                      estado={deudor.Situacion}
                      codigoestudiante={deudor.fkCodigoAlumno}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}
```
> Deudas.tsx
```javascript
import { useEffect, useState } from "react";
import { obtenerDeudores } from "../../api/education.api.ts";
import { Deudor } from "../../Types/educationservice.ts";
import { Regresar } from "../../components/Regresar";

export function Deudas() {
  const [deudas, setDeudas] = useState<Deudor[]>([]); // Especifica el tipo de estado como un array de Deudor

  useEffect(() => {
    async function cargarDeudas() {
      const res = await obtenerDeudores();
      setDeudas(res.data); // Actualiza el estado con los datos de deudas
    }
    cargarDeudas();
  }, []);

  return (
    <>
  <Regresar to="/Servicios/Educacion" />
  <div className="flex flex-col gap-4">
    <h2 className="text-xl font-bold">Lista de deudas</h2>
    <div className="overflow-x-auto">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2">Código deuda</th>
            <th className="border px-4 py-2">Cantidad deuda</th>
            <th className="border px-4 py-2">Estado</th>
            <th className="border px-4 py-2">Fecha de vencimiento</th>
            <th className="border px-4 py-2">Código del alumno</th>
          </tr>
        </thead>
        <tbody>
          {deudas.map((deuda) => (
            <tr key={deuda.CodigoDeuda}>
              <td className="border text-center px-4 py-2">{deuda.CodigoDeuda}</td>
              <td className="border text-center px-4 py-2">{deuda.CantidadDeuda}</td>
              <td className={`border font-bold text-center px-4 py-2 ${deuda.Estado ? 'text-green-600' : 'text-orange-500'}`}>
                {deuda.Estado ? "Pagado" : "Pendiente"}
              </td>              
              <td className="border text-center px-4 py-2">{deuda.FechaVencimiento}</td>
              <td className="border text-center px-4 py-2">{deuda.fkCodigoAlumno}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
</>

  );
}
```
> InicioEducacion.tsx
```javascript
import { OpcionesInicio } from "../../components/OpcionesInicio";
import { Regresar } from "../../components/Regresar";

export function InicioEducation() {
  return (
    <div className="flex flex-col">
      <div>
      <Regresar to="/Servicios" />
      </div>
      <h1 className="text-4xl font-bold mb-24 text-left mt-2">
        Pagos de Educación
      </h1>
      <div className="flex justify-center items-center flex-grow gap-5">
        <OpcionesInicio to="/Servicios/Educacion/Pagar" text="Pagar Deuda" />
        <OpcionesInicio to="/Servicios/Educacion/Deudas" text="Deudas" />
        <OpcionesInicio to="/Servicios/Educacion/Pagos" text="Pagos" />
      </div>
    </div>
  );
}
```
> PagarDeudas.tsx
```javascript
import { CardOptions } from "../../components/CardOptions";
import { Regresar } from "../../components/Regresar";
import logoupt from "../../assets/images/LogoUpt.png"
import logounjbg from "../../assets/images/LogoUnjbg.png"

export function PagarDeudas() {
  return (
    <>
      {/* Componente Regresar para volver a la página anterior */}
      <Regresar to="/Servicios/Educacion" />
      <div className="container mx-auto px-4 py-8">
        {/* Título de la página */}
        <h1 className="text-3xl font-bold mb-4">Elija la entidad</h1>
        <div className="max-w-md mx-auto gap-10 flex flex-row">
          {/* Componente CardOptions para mostrar una opción de pago */}
          <CardOptions
            imageSrc={logoupt}
            altText="Logo Upt"
            to="/Servicios/Educacion/BusquedaPago"
          />
          {/* Componente CardOptions para mostrar otra opción de pago */}
          <CardOptions
            imageSrc={logounjbg}
            altText="Logo Unjbg"
            to="/"
          />
        </div>
      </div>
    </>
  );
}
```
> Pagos.tsx
```javascript
import { Regresar } from "../../components/Regresar";
import { useEffect, useState } from "react";
import { obtenerPagos } from "../../api/education.api.ts";
import { Pago } from "../../Types/educationservice.ts";

export function Pagos() {
  // Estado para almacenar los pagos
  const [pagos, setPagos] = useState<Pago[]>([]);

  useEffect(() => {
    // Función asincrónica para cargar los pagos
    async function cargarPagos() {
      // Llamada a la API para obtener los pagos
      const res = await obtenerPagos();
      // Actualizar el estado con los datos de los pagos recibidos
      setPagos(res.data);
      console.log(res);
    }
    // Llamar a la función cargarPagos cuando el componente se monta
    cargarPagos();
  }, []);

  return (
    <>
      {/* Componente Regresar para volver a la página anterior */}
      <Regresar to="/Servicios/Educacion" />
      <div className="flex flex-col gap-4">
        {/* Título de la lista de pagos */}
        <h2 className="text-xl font-bold">Lista de pagos</h2>
        <div className="overflow-x-auto">
          {/* Tabla para mostrar los pagos */}
          <table className="table-auto w-full">
            <thead>
              <tr>
                <th className="border px-4 py-2">Código pago</th>
                <th className="border px-4 py-2">Monto pago</th>
                <th className="border px-4 py-2">Fecha de pago</th>
                <th className="border px-4 py-2">Código de deuda</th>
              </tr>
            </thead>
            <tbody>
              {/* Mapeo de los pagos para mostrar cada fila de la tabla */}
              {pagos.map((pago) => (
                <tr key={pago.CodigoPago}>
                  <td className="border text-center px-4 py-2">
                    {pago.CodigoPago}
                  </td>
                  <td className="border text-center px-4 py-2">
                    {pago.MontoPago}
                  </td>
                  <td className="border text-center px-4 py-2">
                    {pago.FechaPago}
                  </td>
                  <td className="border text-center px-4 py-2">
                    {pago.FKCodigoDeuda}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
```
> RealizarPago.tsx
```javascript
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { pagarDeuda } from "../../api/education.api.ts";
import { Deuda } from "../../Types/educationservice.ts";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Regresar } from "../../components/Regresar.tsx";

export function RealizarPago() {
  // Configuración del formulario con react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  
  // Utilidad de navegación de react-router-dom
  const navigate = useNavigate();

  // Obtener la ubicación actual de react-router-dom
  const location = useLocation();
  
  // Estado para el mensaje de error
  const [errorMessage, setErrorMessage] = useState("");

  // Obtener parámetros de búsqueda de la URL
  const searchParams = new URLSearchParams(location.search);
  const codigoDeuda = searchParams.get("codigoDeuda");
  const montoPago = searchParams.get("MontoPago");
  const codigoCuenta = searchParams.get("CodigoCuenta");

  // Cargar los valores iniciales en los campos del formulario
  useEffect(() => {
    if (codigoDeuda) {
      setValue("CodigoDeuda", codigoDeuda);
    }
    if (codigoCuenta) {
      setValue("CodigoCuenta", codigoCuenta);
    }
    if (montoPago) {
      setValue("MontoPago", montoPago);
    }
  }, [codigoDeuda, codigoCuenta, montoPago, setValue]);

  // Función para manejar el envío del formulario
  const onSubmit = handleSubmit(async (data) => {
    try {
      // Crear objeto de deuda con los datos del formulario
      const deudaData: Deuda = {
        CodigoDeuda: data.CodigoDeuda,
        CodigoCuenta: data.CodigoCuenta,
        MontoPago: parseInt(data.MontoPago),
      };

      // Realizar el pago de la deuda llamando a la API
      const res = await pagarDeuda(deudaData);
      console.log(res);

      // Mostrar una notificación de éxito
      const style = {
        background: "#202033",
        color: "#fff",
      };
      toast.success("Pago realizado correctamente", {
        position: "top-right",
        style,
      });

      // Navegar a la página de servicios de educación
      navigate("/Servicios/Educacion");
    } catch (error) {
      console.log(error);

      // Manejo de errores específicos
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setErrorMessage("No se ha encontrado la cuenta");
      } else if (axios.isAxiosError(error) && error.response?.status === 400) {
        setErrorMessage(error.response.data.mensaje);

        const errorMessage = error.response.data.mensaje;
        if (errorMessage === "La deuda ya ha sido pagada.") {
          toast.success("La deuda ya ha sido pagada.", {
            position: "top-center",
            style: {
              background: "#202033",
              color: "#fff",
            },
          });
          navigate("/Servicios/Educacion/");
        } else {
          setErrorMessage((error as Error).message);
        }
      } else {
        setErrorMessage((error as Error).message);
      }
    }
  });

  return (
    <>
      {/* Componente Regresar para volver a la página anterior */}
      <Regresar to="/Servicios/Educacion/BusquedaPago" />

      {/* Título del formulario */}
      <h1>Formulario de Pago</h1>

      {/* Formulario */}
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-4 items-center mx-auto mt-4"
      >
        {/* Campo para el código de deuda */}
        <input
          type="number"
          min="0"
          placeholder="Código de deuda"
          {...register("CodigoDeuda", { required: true })}
          className="p-2 rounded border border-gray-300"
          disabled
        />
        {errors.CodigoDeuda && (
          <span className="text-red-500">Código de deuda requerido</span>
        )}

        {/* Campo para el código de cuenta */}
        <input
          type="number"
          min="0"
          placeholder="Codigo Cuenta"
          {...register("CodigoCuenta", { required: true })}
          className="p-2 rounded border border-gray-300"
        />
        {errors.CodigoDeuda && (
          <span className="text-red-500">Código de Cuenta requerido</span>
        )}

        {/* Campo para el monto de pago */}
        <input
          type="number"
          min="0"
          placeholder="Cantidad de deuda"
          {...register("MontoPago", { required: true })}
          className="p-2 rounded border border-gray-300"
          disabled
        />
        {errors.MontoPago && (
          <span className="text-red-500">Monto de pago requerido </span>
        )}

        {/* Mostrar mensaje de error */}
        {errorMessage && <span className="text-red-500">{errorMessage}</span>}

        {/* Botones de cancelar y guardar */}
        <div className="flex gap-4">
          <Link
            to="/Servicios/Educacion"
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Guardar
          </button>
        </div>
      </form>
    </>
  );
}

```
5.2. Sevicio Internet
> DeudoresInternet.tsx
```javascript
import { useEffect, useState } from "react";
import { obtenerDeudores } from "../../api/internet.api.ts";
import { Deudor } from "../../Types/internetservice.ts";
import { Regresar } from "../../components/Regresar";

export function DeudoresInternet() {
  const [deudas, setDeudas] = useState<Deudor[]>([]); // Especifica el tipo de estado como un array de Deudor

  useEffect(() => {
    async function cargarDeudas() {
      const res = await obtenerDeudores();
      setDeudas(res.data); // Actualiza el estado con los datos de deudas
    }
    cargarDeudas();
  }, []);

  return (
    <>
      <Regresar to="/Servicios/Internet" />
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Lista de deudores</h2>

        <table className="table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2">Código</th>
              <th className="border px-4 py-2">Nombre</th>
              <th className="border px-4 py-2">Apellido</th>
              <th className="border px-4 py-2">Monto Deuda</th>
              <th className="border px-4 py-2">Fecha de vencimiento</th>
              <th className="border px-4 py-2">Estado</th>
            </tr>
          </thead>

          <tbody>
            {deudas.map((deuda) => (
              <tr key={deuda.CodigoDeudInter}>
                <td className="border px-4 py-2">{deuda.CodigoDeudInter}</td>
                <td className="border px-4 py-2">{deuda.Nombre}</td>
                <td className="border px-4 py-2">{deuda.Apellido}</td>
                <td className="border px-4 py-2">{deuda.MonDeuda}</td>
                <td className="border px-4 py-2">{deuda.FechVenc}</td>
                <td className="border px-4 py-2">{deuda.Estado ? "Pagado" : "Pendiente"}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
```
> InicioInternet.tsx
```javascript
import { OpcionesInicio } from "../../components/OpcionesInicio";
import { Regresar } from "../../components/Regresar";

export function InicioInternet() {
  return (
    <div className="flex flex-col">
      <div>
      <Regresar to="/Servicios" />
      </div>
      <h1 className="text-4xl font-bold mb-24 text-left mt-2">
        Pagos de Internet
      </h1>
      <div className="flex justify-center items-center flex-grow gap-5">
        <OpcionesInicio to="/Servicios/Internet/Pagar" text="Pagar Deuda" />
        <OpcionesInicio to="/Servicios/Internet/Deudores" text="Deudores" />
      </div>
    </div>
  );
}
```
> PagosInternet.tsx
```javascript
import { useState } from "react";
import { useForm } from "react-hook-form";
import { buscarDeuda } from "../../api/education.api.ts";
import { Deudor } from "../../Types/educationservice.ts";
import { ContentTDeudas } from "../../components/EducationService/ContentTDeudas";
import { Regresar } from "../../components/Regresar.tsx";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { buscarDeuda } from "../../api/internet.api.ts";
import { Deudor } from "../../Types/internetservice.ts";

import { ContentTDeudas } from "../../components/InternetService/ContentTDeudas";
import { Regresar } from "../../components/Regresar.tsx";


export function BusquedaPagoInternet() {
  const [deudores, setDeudores] = useState<Deudor[]>([]);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    const CodigoDeudInter = data.CodigoDeudInter;

    try {
      const response = await buscarDeuda(parseInt(CodigoDeudInter));
      setDeudores([response.data]);
      setError("");
    } catch (error) {
      console.log(error);
      setDeudores([]);
      setError("Deudor no encontrado");
    }
  });


  return (
    <>
      <Regresar to="/Servicios/Internet/" />
      <div className="mt-4">
        <form onSubmit={onSubmit}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              {...register("CodigoDeudInter", { required: true })}
              className="block w-full p-4 pl-10 text-lg text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Ingrese el código del Deudor"
              required
            />
            {errors.CodigoDeudInter && (
              <span className="text-red-500">
                Código de Deudor requerido
              </span>
            )}
            <button
              type="submit"
              className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Search
            </button>
          </div>
        </form>{" "}

        <div className="container mx-auto px-4 py-8">
          {error && <p className="text-red-500">{error}</p>}
          {console.log(deudores)}
          {console.log(deudores.length)}
          {deudores.length > 0 ? (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-300 dark:text-gray-300">
                <thead className="text-xs text-gray-600 uppercase dark:text-gray-300">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-gray-600">
                      Codigo de deuda
                    </th>
                    <th scope="col" className="px-6 py-3 text-gray-600">
                      Monto de Deuda
                    </th>
                    <th scope="col" className="px-6 py-3 text-gray-600">
                      FechVenc
                    </th>
                    <th scope="col" className="px-6 py-3 text-gray-600">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3 text-gray-600">
                      Accion
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {deudores.map((deudor) => (
                    <ContentTDeudas
                      key={deudor.CodigoDeudInter}
                      CodigoDeudInter={deudor.CodigoDeudInter.toString()}
                      MonDeuda={deudor.MonDeuda}
                      FechVenc={deudor.FechVenc}
                      Estado={deudor.Estado}
                    />
                  ))}
                </tbody>
                


              </table>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
}

```
> RealizarPago.tsx
```javascript
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import { pagarDeuda } from "../../api/internet.api.ts";
import { Deuda } from "../../Types/internetservice";

import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Regresar } from "../../components/Regresar.tsx";

export function RealizarPagoInternet() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState("");
  const searchParams = new URLSearchParams(location.search);
  const codigoDeuda = searchParams.get("codigoDeuda");
  const montoPago = searchParams.get("MontoPago");

  useEffect(() => {
    if (codigoDeuda) {
      setValue("CodigoDeuda", codigoDeuda);
    }
    if (montoPago) {
      setValue("MontoPago", montoPago);
    }
  }, [codigoDeuda, montoPago, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const deudaData: Deuda = {
        CodigoDeudInter: parseInt(data.CodigoDeuda),
        MonPago: parseInt(data.MontoPago),
      };
      const res = await pagarDeuda(parseInt(data.CodigoDeuda),deudaData);
      console.log(res);

      const style = {
        background: "#202033",
        color: "#fff",
      };

      toast.success("Pago realizado correctamente", {
        position: "top-right",
        style,
      });
      navigate("/Servicios/Internet");
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setErrorMessage("No se ha encontrado el ID del usuario");
      } else if (axios.isAxiosError(error) && error.response?.status === 400) {
        setErrorMessage(error.response.data.mensaje);
      } else {
        setErrorMessage((error as Error).message);
      }
    }
  });

  return (
    <>
      <Regresar to="/Servicios/Internet/Pagar" />
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-4 items-center mx-auto mt-4"
      >
        <input
          type="number"
          min="0"
          placeholder="Código de deuda"
          {...register("CodigoDeuda", { required: true })}
          className="p-2 rounded border border-gray-300"
          disabled
        />
        {errors.CodigoDeuda && (
          <span className="text-red-500">Código de deuda requerido</span>
        )}

        <input
          type="number"
          min="0"
          placeholder="Cantidad de deuda"
          {...register("MontoPago", { required: true })}
          className="p-2 rounded border border-gray-300"
          disabled
        />
        {errors.MontoPago && (
          <span className="text-red-500">Monto de pago requerido </span>
        )}

        {errorMessage && <span className="text-red-500">{errorMessage}</span>}

        <div className="flex gap-4">
          <Link
            to="/Servicios/Internet"
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Guardar
          </button>
        </div>
      </form>
    </>
  );
}
```
5.3. Sevicio Luz
> Busqueda.tsx
```javascript
import { useEffect, useState } from "react";
import { obtenerDeudores } from "../../api/internet.api.ts";
import { Deudor } from "../../Types/internetservice.ts";
import { Regresar } from "../../components/Regresar";

export function DeudoresInternet() {
  const [deudas, setDeudas] = useState<Deudor[]>([]); // Especifica el tipo de estado como un array de Deudor

  useEffect(() => {
    async function cargarDeudas() {
      const res = await obtenerDeudores();
      setDeudas(res.data); // Actualiza el estado con los datos de deudas
    }
    cargarDeudas();
  }, []);

  return (
    <>
      <Regresar to="/Servicios/Internet" />
      <div className="flex flex-col gap-4">
        <h2 className="text-xl font-bold">Lista de deudores</h2>

        <table className="table-auto">
          <thead>
            <tr>
              <th className="border px-4 py-2">Código</th>
              <th className="border px-4 py-2">Nombre</th>
              <th className="border px-4 py-2">Apellido</th>
              <th className="border px-4 py-2">Monto Deuda</th>
              <th className="border px-4 py-2">Fecha de vencimiento</th>
              <th className="border px-4 py-2">Estado</th>
            </tr>
          </thead>

          <tbody>
            {deudas.map((deuda) => (
              <tr key={deuda.CodigoDeudInter}>
                <td className="border px-4 py-2">{deuda.CodigoDeudInter}</td>
                <td className="border px-4 py-2">{deuda.Nombre}</td>
                <td className="border px-4 py-2">{deuda.Apellido}</td>
                <td className="border px-4 py-2">{deuda.MonDeuda}</td>
                <td className="border px-4 py-2">{deuda.FechVenc}</td>
                <td className="border px-4 py-2">{deuda.Estado ? "Pagado" : "Pendiente"}</td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}import { useState } from "react";
import { useForm } from "react-hook-form";
import { buscarDeuda } from "../../api/luz.api.ts";
import { ContentTDeudas } from "../../components/LuzService/ContentTDeudas";
import { Regresar } from "../../components/Regresar.tsx";
import { Deuda } from "../../Types/luzservice.ts";

export function Busqueda() {
  const [deudor, setDeudor] = useState<Deuda | null>(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = handleSubmit(async (data) => {
    const codigoDeuda = data.CodigoDeuda;
    console.log("Valor de CodigoDeuda:", codigoDeuda); // Imprimir el valor en la consola

    setIsLoading(true);
    setError("");

    try {
      const response = await buscarDeuda(parseInt(codigoDeuda));
      const deuda = response.data;

      if (deuda) {
        setDeudor(deuda);
      } else {
        setDeudor(null);
        setError("Deuda no encontrada");
      }
    } catch (error) {
      console.log(error);
      setDeudor(null);
      setError("Algo salió mal al obtener la deuda");
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <>
      <Regresar to="/Servicios/Luz" />
      <div className="mt-4">
        <form onSubmit={onSubmit}>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 20 20"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
                />
              </svg>
            </div>
            <input
              type="search"
              id="default-search"
              {...register("CodigoDeuda", { required: true })}
              className="block w-full p-4 pl-10 text-lg text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="Ingrese el código de la deuda"
              required
            />
            {errors.CodigoDeuda && (
              <span className="text-red-500">
                Código de deuda requerido
              </span>
            )}
            <button
              type="submit"
              className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              disabled={isLoading}
            >
              {isLoading ? "Buscando..." : "Buscar"}
            </button>
          </div>
        </form>
        <div className="container mx-auto px-4 py-8">
          {error && <p className="text-red-500">{error}</p>}
          {deudor && (
            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-gray-300 dark:text-gray-300">
                <thead className="text-xs text-gray-600 uppercase dark:text-gray-300">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-gray-600">
                      Codigo de deuda
                    </th>
                    <th scope="col" className="px-6 py-3 text-gray-600">
                      Cantidad
                    </th>
                    <th scope="col" className="px-6 py-3 text-gray-600">
                      Vencimiento
                    </th>
                    <th scope="col" className="px-6 py-3 text-gray-600">
                      Estado
                    </th>
                    <th scope="col" className="px-6 py-3 text-gray-600">
                      Accion
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <ContentTDeudas
                    codigo_Deuda={deudor.codigo_deuda}
                    Monto={deudor.Monto}
                    FechaVenc={deudor.FechaVencimientoPago}
                    Estado={deudor.Estado}
                  
                  />
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
```
> Deudas.tsx
```javascript
import { useEffect, useState } from "react";
import { obtenerDeudores } from "../../api/luz.api.ts";
import { Clientes } from "../../Types/luzservice.ts";
import { Regresar } from "../../components/Regresar";

export function DeudasLuz() {
  const [deudas, setDeudas] = useState<Clientes[]>([]);

  useEffect(() => {
    async function cargarDeudas() {
      const res = await obtenerDeudores();
      setDeudas(res.data);
    }
    cargarDeudas();
  }, []);

  return (
    <>
      <Regresar to="/Servicios/Luz" />
      <div className="flex flex-col gap-4">
        <h2>Lista de deudas</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                Código deuda
              </td>
              <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                Cantidad deuda
              </td>
              <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                Estado
              </td>
              <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                Fecha de vencimiento
              </td>
              <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                Código del Cliente
              </td>
            </tr>
          </thead>
          <tbody>
            {deudas.map((deuda) => (
              <tr key={deuda.CodigoDeuda}>
                <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                  {deuda.CodigoDeuda}
                </td>
                <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                  {deuda.Monto}
                </td>
                <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                  {deuda.Estado}
                </td>
                <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                  {deuda.FechaVencimientoPago}
                </td>
                <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                  {deuda.FkCodigoCliente}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
```
> InicioLuz.tsx
```javascript
import { OpcionesInicio } from "../../components/OpcionesInicio";
import { Regresar } from "../../components/Regresar";

export function InicioLuz() {
  return (
    <div className="flex flex-col">
      <div>
      <Regresar to="/Servicios" />
      </div>
      <h1 className="text-4xl font-bold mb-24 text-left mt-2">
        Pagos de Luz
      </h1>
      <div className="flex justify-center items-center flex-grow gap-5">
        <OpcionesInicio to="/Servicios/Luz/RealizarPago" text="Pagar Deuda" />
        <OpcionesInicio to="/Servicios/Luz/Deudas" text="Deudas" />
        <OpcionesInicio to="/Servicios/Luz/Pagos" text="Pagos" />
      </div>
    </div>
  );
}
```
> PagoLuz.tsx
```javascript
import { Regresar } from "../../components/Regresar";
import { useEffect, useState } from "react";
import { obtenerPagos } from "../../api/luz.api.ts";
import { Pagos } from "../../Types/luzservice.ts";

export function PagosLuz() {
  const [pagos, setPagos] = useState<Pagos[]>([]);

  useEffect(() => {
    async function cargarPagos() {
      const res = await obtenerPagos();
      setPagos(res.data);
      console.log(res);
    }
    cargarPagos();
  }, []);

  return (
    <>
      <Regresar to="/Servicios/Luz" />
      <div className="flex flex-col gap-4">
        <h2>Lista de pagos</h2>
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                Código pago
              </td>
              <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                Monto pago
              </td>
              <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                Fecha de pago
              </td>
              <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                Código de deuda
              </td>
            </tr>
          </thead>
          <tbody>
            {pagos.map((pago) => (
              <tr key={pago.CodigoPago}>
                <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                  {pago.CodigoPago}
                </td>
                <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                  {pago.Pago}
                </td>
                <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                  {pago.FechaPago}
                </td>
                <td style={{ borderWidth: "2px" }} className="border px-4 py-2">
                  {pago.CodigoDeuda}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
```
> RealizarPago.tsx
```javascript
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { pagarDeuda } from "../../api/luz.api";
import { Pagos } from "../../Types/luzservice";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { Regresar } from "../../components/Regresar";

export function RealizarPago() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();
  const navigate = useNavigate();
  const location = useLocation();
  const [errorMessage, setErrorMessage] = useState("");
  const searchParams = new URLSearchParams(location.search);
  const codigoDeuda = searchParams.get("codigoDeuda");
  const montoPago = searchParams.get("Monto");

  useEffect(() => {
    if (codigoDeuda) {
      setValue("CodigoDeuda", codigoDeuda);
    }
    if (montoPago) {
      setValue("MontoPago", montoPago);
    }
  }, [codigoDeuda, montoPago, setValue]);

  const onSubmit = handleSubmit(async (data) => {
    try {
      const pagoData: Pagos = {
        CodigoPago: data.CodigoPago,
        CodigoDeuda: parseInt(data.CodigoDeuda),
        Pago: parseInt(data.MontoPago),
        FechaPago: data.FechaPago,
      };
      const res = await pagarDeuda(pagoData);
      console.log(res);

      const style = {
        background: "#202033",
        color: "#fff",
      };

      toast.success("Pago realizado correctamente", {
        position: "top-right",
        style,
      });
      navigate("/Servicios/Educacion");
    } catch (error) {
      console.log(error);

      if (axios.isAxiosError(error) && error.response?.status === 404) {
        setErrorMessage("No se ha encontrado el ID del usuario");
      } else if (axios.isAxiosError(error) && error.response?.status === 400) {
        setErrorMessage(error.response.data.mensaje);
      } else {
        setErrorMessage((error as Error).message);
      }
    }
  });

  return (
    <>
      <Regresar to="/Servicios/Luz" />
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-4 items-center mx-auto mt-4"
      >
        <input
          type="text"
          placeholder="Código de pago"
          {...register("CodigoPago", { required: true })}
          className="p-2 rounded border border-gray-300"
        />
        {errors.CodigoPago && (
          <span className="text-red-500">Código de pago requerido</span>
        )}

        <input
          type="number"
          min="0"
          placeholder="Código de deuda"
          {...register("CodigoDeuda", { required: true })}
          className="p-2 rounded border border-gray-300"
        />
        {errors.CodigoDeuda && (
          <span className="text-red-500">Código de deuda requerido</span>
        )}

        <input
          type="number"
          min="0"
          placeholder="Cantidad de pago"
          {...register("MontoPago", { required: true })}
          className="p-2 rounded border border-gray-300"
        />
        {errors.MontoPago && (
          <span className="text-red-500">Cantidad de pago requerida</span>
        )}

        <input
          type="date"
          placeholder="Fecha de pago"
          {...register("FechaPago", { required: true })}
          className="p-2 rounded border border-gray-300"
        />
        {errors.FechaPago && (
          <span className="text-red-500">Fecha de pago requerida</span>
        )}

        {errorMessage && <span className="text-red-500">{errorMessage}</span>}

        <div className="flex gap-4">
          <Link
            to="/Servicios/Luz"
            className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded"
          >
            Pagar
          </button>
        </div>
      </form>
    </>
  );
}
```
5.3. Sevicio Telefono
> Facturas.tsx
```javascript
import { useEffect, useState } from "react";
import { obtenerfactura } from "../../api/Telephony.ts";
import { Factura } from "../../Types/telephonyservice.ts";
import { Regresar } from "../../components/Regresar";

export function Facturas() {
    const [facturas, setFacturas] = useState<Factura[]>([]);
  
    useEffect(() => {
      async function cargarFacturas() {
        try {
          const res = await obtenerfactura();
          setFacturas(res.data);
        } catch (error) {
          console.error(error);
        }
      }
      cargarFacturas();
    }, []);
  
    return (
      <>
        {<Regresar to="/Servicios/Telefonia" />}
        <div className="flex flex-col gap-4"></div>
        <h2 className="text-xl font-bold" >Lista de facturas</h2><br></br>
        <div className="overflow-x-auto">
        <table className="table-auto w-full">
          <thead>
            <tr>
              <th className="border px-4 py-2">Cliente</th>
              <th className="border px-4 py-2">Plan</th>
              <th className="border px-4 py-2">Monto</th>
              <th className="border px-4 py-2">Fecha de emisión</th>
              <th className="border px-4 py-2">Fecha de vencimiento</th>
              <th className="border px-4 py-2">Pagado</th>
              <th className="border px-4 py-2">Estado</th>
            </tr>
          </thead>
          <tbody>
            {facturas.map((factura) => (
              <tr key={factura.id}>
                <td className="border text-center px-4 py-2">{factura.cliente}</td>
                <td className="border text-center px-4 py-2">{factura.plan}</td>
                <td className="border text-center px-4 py-2">{factura.monto}</td>
                <td className="border text-center px-4 py-2">{factura.fecha_emision}</td>
                <td className="border text-center px-4 py-2">{factura.fecha_vencimiento}</td>
                <td className={`border font-bold text-center px-4 py-2 ${factura.pagado ? 'text-green-600' : 'text-orange-500'}`}>{factura.pagado ? 'Sí' : 'No'}</td>
                <td className="border text-center px-4 py-2">{factura.estado ? 'Activo' : 'Inactivo'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </>
    );
  }
```
> IndexService.tsx
```javascript
import { OpcionesInicio } from "../../components/OpcionesInicio";
import { Regresar } from "../../components/Regresar";

export function IndexService() {
  return (
    <div className="flex flex-col">
      <div>
      <Regresar to="/Servicios" />
      </div>
      <h1 className="text-4xl font-bold mb-24 text-left mt-2">
        Pagos de Telefonia
      </h1>
      <div className="flex justify-center items-center rounded-md flex-grow gap-5">
        <OpcionesInicio to="/Servicios/Telefonia/Facturas" text="Facturas" />
        <OpcionesInicio to="/Servicios/Telefonia/Planes" text="Recarga" />
      </div>
    </div>
  );
}
```
> Plan.tsx
```javascript
import { obtenerplan,elegirplan } from "../../api/Telephony.ts";
import { Plan } from "../../Types/telephonyservice.ts";
import { useEffect, useState } from "react";
import { Regresar } from "../../components/Regresar";
import { useNavigate } from "react-router-dom";

export function Planes() {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function cargarPlanes() {
      try {
        const res = await obtenerplan();
        setPlanes(res.data);
      } catch (error) {
        console.error(error);
      }
    }
    cargarPlanes();
  }, []);

  const handleSeleccionarPlan = async (plan_id: number, costo_mensual: number) => {
    const idcliente = 1;
    try {
      // Llamar a la función "elegirplan" y pasar el plan_id y el costo_mensual
      await elegirplan(idcliente, plan_id, costo_mensual);
    } catch (error) {
      console.error(error);
    }finally {
      navigate(`/Servicios/Telefonia/RealizarPago?id_cliente=${idcliente}&monto=${costo_mensual}`);
    }
  };
  return (
    <>
      <div className="flex flex-col">
      <div>
      <Regresar to="/Servicios/Telefonia" />
      </div>
      <h1 className="text-4xl font-bold mb-24 text-left mt-2">Elegir tu Plan</h1> 
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 px-4">
        {planes.map((plan) => (
          <div
            key={plan.id}
            className="bg-white rounded-lg shadow-xl p-6 flex flex-col justify-between"
          >
            <h2 className="text-xl font-bold mb-4">{plan.nombre}</h2>
            <div className="flex flex-col gap-2">
              <p className="text-gray-700 text-center font-semibold">
                <span className="font-bold "></span>{" "}
                S/{plan.costo_mensual}
              </p><hr />
              <div className="bg-blue-900 rounded-full py-2 px-4 mt-4 font-bold text-center">
              <p className="text-neutral-100" >
                <span className="font-semibold"></span>{" "}
                {plan.minutos_incluidos} Min
              </p>
              <p className="text-neutral-100">
                <span className="font-semibold"></span>{" "}
                {plan.datos_incluidos} GB
              </p>
              </div>
            </div>
            <button className="bg-blue-900 hover:bg-orange-600 text-white font-semibold py-2 px-4 mt-4 rounded-md" onClick={() => handleSeleccionarPlan(plan.id, plan.costo_mensual)}>
              ¡Me Interesa!
            </button>
          </div>
        ))}
      </div><br/><br/>
    </div>
    </>
  );
}
```
> RealizarPago.tsx
```javascript
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { buscarcliente, actualizarsaldo } from "../../api/Telephony.ts";
import { Regresar } from "../../components/Regresar";

export function RealizarPago() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const id_cliente = searchParams.get("id_cliente");
  const monto = searchParams.get("monto");

  const [mensaje, setMensaje] = useState("");

  useEffect(() => {
    if (id_cliente && monto) {
      buscarClienteYActualizarSaldo(Number(id_cliente), Number(monto));
    }
  }, [id_cliente, monto]);

  const buscarClienteYActualizarSaldo = async (clienteId: number, monto: number) => {
    try {
      // Obtener los datos del cliente
      const res = await buscarcliente(clienteId);
      const cliente = res.data;

      // Restar el monto a la cuenta bancaria
      if (cliente.cuenta_bancaria >= monto) {
        // Restar el monto a la cuenta bancaria
        const nuevoSaldo = cliente.cuenta_bancaria - monto;
  
        // Actualizar los datos del cliente con el nuevo saldo
        await actualizarsaldo(clienteId, cliente.nombre, cliente.direccion, cliente.telefono, nuevoSaldo, cliente.servicio_activo);
  
        setMensaje("Su recarga se realizó exitosamente.");
      } else {
        setMensaje("Saldo insuficiente para realizar la recarga.");
      }
    } catch (error) {
      console.error(error);
      setMensaje("Hubo algun error en su recarga.");
    }
  };

  return (
    <>
    <div>
      <Regresar to="/Servicios/Telefonia" />
    </div>
    <div className="container mx-auto mt-8">
    <div className="flex w-100 shadow-lg rounded-lg">
      <div className="bg-green-600 py-4 px-6 rounded-l-lg flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="text-white fill-current" viewBox="0 0 16 16" width="20" height="20"><path fill-rule="evenodd" d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"></path></svg>
      </div>
      <div className="px-4 py-6 bg-white rounded-r-lg flex justify-between items-center w-full border border-l-transparent border-gray-200">
        <div><h1 className="text-4xl font-bold mb-4">{mensaje}</h1></div>
      </div>
    </div><br></br>
      <p className="text-lg font-semibold">ID Cliente: {id_cliente}</p>
      <p className="text-lg font-semibold">Monto: {monto}</p>
    </div>
  
    </>
  );
}
```
