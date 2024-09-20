from django.urls import path
from .views_seguimiento import SeguimientoDetail, SeguimientoList, descargar_formato_evaluacion, descargar_correciones

urlpatterns = [
    path('seguimientos/', SeguimientoList.as_view(), name='seguimiento-list'),
    path('seguimientos/<int:pk>/', SeguimientoDetail.as_view(), name='seguimiento-detail'),
    path('seguimientos/<int:pk>/descargar/formato_evaluacion/', descargar_formato_evaluacion, name='descargar-formato_evaluacion'),
    path('seguimientos/<int:pk>/descargar/correciones/', descargar_correciones, name='descargar-correciones'),
]
