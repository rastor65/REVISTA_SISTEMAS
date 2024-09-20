from django.urls import path
from .views_autorXF import UsuarioXFormacionList, UsuarioXFormacionDetail, descargar_cert_grado

urlpatterns = [
    path('usuarioxformacion/', UsuarioXFormacionList.as_view()),
    path('usuarioxformacion/<int:pk>/', UsuarioXFormacionDetail.as_view()),
    path('usuarioxformacion/<int:pk>/descargar/cert_grado/', descargar_cert_grado, name='descargar-cert-grado'),
]
