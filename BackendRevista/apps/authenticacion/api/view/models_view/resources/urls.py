from django.urls import path
from .resources import ResourceList, ResourceDetail

urlpatterns = [
    path('', ResourceList.as_view(), name='resources-list-create'),
    path('<int:pk>/', ResourceDetail.as_view(), name='resources-update-delete'),
]
