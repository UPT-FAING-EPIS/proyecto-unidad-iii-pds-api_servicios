

from django.contrib import admin
from django.urls import path, include
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from requests import post
from django.contrib import admin



schema_view = get_schema_view(
   openapi.Info(
      title="SERVICIOS DE Internet",
      default_version='v1',
      description="Integrantes:",
      terms_of_service="",
      contact=openapi.Contact(email="contact@snippets.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('ServicioInternet/', include('InternetAPP.urls')),
    path('docs/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc')
]
