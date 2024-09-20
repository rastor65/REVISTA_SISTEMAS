from django.urls import path, include,re_path
from django.conf import settings
from django.contrib import admin
from django.conf.urls.static import static

from rest_framework import routers
from rest_framework import permissions

from drf_yasg import openapi
from drf_yasg.views import get_schema_view

# Api router
router = routers.DefaultRouter()

schema_view = get_schema_view(
    openapi.Info(
        title="Snippets API",
        default_version='v1',
        description="Test description",
        terms_of_service="https://www.google.com/policies/terms/",
        contact=openapi.Contact(email="contact@snippets.local"),
        license=openapi.License(name="BSD License"),
    ),
    public=True,
    permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    # Admin routes
    path('admin/', admin.site.urls),

    # Api routes
    path('api/', include('apps.authenticacion.urls')),
    path('api/', include(router.urls)),
    path('', include('apps.authenticacion.api.urls')),
    path('pqrs/', include('apps.pqrs.api.urls')),
    path('solicitud/', include('apps.solicitudes.api.urls')),
    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc')
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
