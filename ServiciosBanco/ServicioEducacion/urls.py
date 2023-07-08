from django.urls import path, include
from rest_framework import routers
from .views import AlumnoViews, DeudasAlumnoViews, BuscarDeudores, HealthCheckView, PagosAlumnoViews
from .pagardecorator import RealizarPagoViews
from .pagodebito import PagoDebitoViews

from django.urls import path

router = routers.DefaultRouter()
router.register('deudas', DeudasAlumnoViews)
router.register('pagos', PagosAlumnoViews)
router.register('alumnos', AlumnoViews)


urlpatterns = [
    path('', include(router.urls)),
    path('pagar/', RealizarPagoViews.as_view(), name='realizar_pago'),
    path('pagarDebito/', PagoDebitoViews.as_view(), name='realizar_pago2'),
    path('listardeudores/<str:fk_codigo_alumno>/', BuscarDeudores.as_view(), name='listar_deudores'),
    path('health/', HealthCheckView.as_view(), name='health-check'),
]
