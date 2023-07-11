from rest_framework.routers import DefaultRouter
from post.api.views import RegistroLlamadasViewSet ,ClienteViewSet ,PlanViewSet , FacturaViewSet

router_posts = DefaultRouter()
router_posts.register('registrollamadas', RegistroLlamadasViewSet)
router_posts.register('clientes', ClienteViewSet)
router_posts.register('planes', PlanViewSet)
router_posts.register('facturas', FacturaViewSet)

