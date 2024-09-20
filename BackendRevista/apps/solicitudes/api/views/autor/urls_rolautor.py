from django.urls import path
from .view_rolautor import RolAutorList, RolAutorDetail

urlpatterns = [
    path('rolautor/', RolAutorList.as_view(), name='rolautors_list'),
    path('rolautor/<int:pk>/', RolAutorDetail.as_view(), name='rolautors_detail'),
]
