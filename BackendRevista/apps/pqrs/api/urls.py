from django.urls import path,include

urlpatterns = [
    path("",include("apps.pqrs.api.views.pqrs.urls")),
    path("anexo/",include("apps.pqrs.api.views.anexo.urls")),
    path("asignacion/",include("apps.pqrs.api.views.asignacion.urls")),
    path("respuesta/",include("apps.pqrs.api.views.respuesta.urls")),
    path("tipo/",include("apps.pqrs.api.views.tipoPqrs.urls")),
]
