from django.urls import path
from .views_pasosS import PasosSeguimientoList, PasosSeguimientoDetail

urlpatterns = [
    path('pasos_seguimiento/', PasosSeguimientoList.as_view(), name='pasos_solicitud_list'),
    path('pasos_seguimiento/<int:pk>/', PasosSeguimientoDetail.as_view(), name='pasos_solicitud_detail'),
]