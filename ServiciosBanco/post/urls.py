# from django.urls import path
# from rest_framework.routers import DefaultRouter
# from post.api.views import RegistroLlamadasViewSet ,ClienteViewSet ,PlanViewSet , FacturaViewSet
# from post.api.views import crear_plan_con_factura,pagar_factura
# from rest_framework import generics

# # router_posts = DefaultRouter()
# # # router_posts.register(prefix='post', basename='post', viewset=PostApiViewSet)
# # # router_posts.update(prefix='post', basename='post', viewset=PostApiViewSet)
# router_posts.register('registrollamadas', RegistroLlamadasViewSet)
# router_posts.register('clientes', ClienteViewSet)
# router_posts.register('planes', PlanViewSet)
# outactura.

from django.contrib import admin
from django.urls import include, path
from .api.router import router_posts
from post.api.views import ClienteViewSet
from post.api.views import crear_plan_con_factura,pagar_factura
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

urlpatterns = [
    path('api/', include(router_posts.urls)),
    path('clientes/<int:pk>/cancelar_servicio/', ClienteViewSet.as_view({'put': 'cancelar_servicio'})),
    path('planes/crear-con-factura/', crear_plan_con_factura, name='crear_plan_con_factura'),
    path('factura/pagar_factura/', pagar_factura, name='pagar_factura'),
]