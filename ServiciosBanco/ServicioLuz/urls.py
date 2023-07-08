from django.urls import path,include
from .views import DeudaListView,DeudaDetailView,PagoListView,PagoDetailView
from rest_framework import routers

router = routers.DefaultRouter()
router.register('deudas', DeudaListView)


urlpatterns = [
    path('deudas/', DeudaListView.as_view(), name='deuda-list'),
    path('deudas/<int:pk>/', DeudaDetailView.as_view(), name='deuda-detail'),
    path('pagos/', PagoListView.as_view(), name='pagos-list'),
    path('pagos/<int:pk>/', PagoDetailView.as_view(), name='pago-detail'),
]
