from django.urls import path, include
from rest_framework import routers
from rest_framework.routers import DefaultRouter
from .api.views import RegistroLlamadasViewSet ,ClienteViewSet ,PlanViewSet , FacturaViewSet

router_posts = DefaultRouter()
router_posts.register('registrollamadas', RegistroLlamadasViewSet)
router_posts.register('clientes', ClienteViewSet)
router_posts.register('planes', PlanViewSet)
router_posts.register('facturas', FacturaViewSet)

urlpatterns = [
    path('', include(router_posts.urls)),
]