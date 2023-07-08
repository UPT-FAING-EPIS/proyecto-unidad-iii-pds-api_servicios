from django.urls import path, include
from rest_framework import routers
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from api_recibos_agua import views


urlpatterns = [
    path('deuda/', views.DeudaViews.as_view(), name='get_deuda'),  # Add the DeudaAlumnoViews
    path('pagos/', views.PagosViews.as_view(), name='pagos_alumno'),  # Add the PagosAlumnoViews
]
