from django.urls import path
from .resources import ResourceRolList, ResourceRolDetail

urlpatterns = [
   path('', ResourceRolList.as_view(), name='resourcesr-list-create'),
   path('<int:pk>/', ResourceRolDetail.as_view(), name='resourcesr-update-delete'),
]
