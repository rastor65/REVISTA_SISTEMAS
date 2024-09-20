from django.urls import path
from .view_autorsolicitud import AutorXSolicitudList, AutorXSolicitudDetail

urlpatterns = [
    path('autorxsolicitud/', AutorXSolicitudList.as_view(), name='autorxsolicitud_list'),
    path('autorxsolicitud/<int:pk>/', AutorXSolicitudDetail.as_view(), name='autorxsolicitud_detail'),
]
