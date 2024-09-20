from django.urls import path
from .views_solicitud import SolicitudDetail, SolicitudList

urlpatterns = [
    path('solicitudes/', SolicitudList.as_view(), name='solicitud'),
    path('solicitudes/<int:pk>/', SolicitudDetail.as_view()),
]
