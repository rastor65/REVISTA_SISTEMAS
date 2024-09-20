from django.urls import path
from .views_estado import EstadoSeguimientoList, EstadoSeguimientoDetail

urlpatterns = [
    path('estado_seguimiento/', EstadoSeguimientoList.as_view(), name='estado-seguimiento-list'),
    path('estado_seguimiento/<int:pk>/', EstadoSeguimientoDetail.as_view(), name='estado-seguimiento-detail'),
]
