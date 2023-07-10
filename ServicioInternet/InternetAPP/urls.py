from django.urls import path,include
from .views import DeudInterListView,DeudInterPagoView
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'Deudores',DeudInterListView,'Deudores')

urlpatterns = [

    path('', include(router.urls)),
    path('pagoInter/<int:CodigoDeudInter>/', DeudInterPagoView.as_view(), name='Internet-detail')
]
