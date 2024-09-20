from django.urls import path, include

urlpatterns = [
    path('contenido/', include('apps.solicitudes.api.views.literatura.urls_contenido')),
    path('revista/', include('apps.solicitudes.api.views.solicitud.urls_revista')),
    path('seguimiento/', include('apps.solicitudes.api.views.seguimiento.urls_seguimiento')),
    path('estado/', include('apps.solicitudes.api.views.seguimiento.urls_estado')),
    path('anexo/', include('apps.solicitudes.api.views.seguimiento.urls_anexo')),
    path('solicitud/', include('apps.solicitudes.api.views.solicitud.urls_solicitud')),
    path('pasossolicitud/', include('apps.solicitudes.api.views.solicitud.urls_pasosS')),
]