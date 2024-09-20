from django.urls import path
from .views_contenido import ContenidoSolicitudList, ContenidoSolicitudDetail, descargar_archivo, descargar_originalidad

urlpatterns = [
    path('contenido/', ContenidoSolicitudList.as_view(), name='contenido-list'),
    path('contenido/<int:pk>/', ContenidoSolicitudDetail.as_view(), name='contenido-detail'),
    path('contenido/<int:pk>/archivo_adjunto/', descargar_archivo, name='descargar-archivo'),
    path('contenido/<int:pk>/originalidad/', descargar_originalidad, name='descargar-archivo'),  
]
