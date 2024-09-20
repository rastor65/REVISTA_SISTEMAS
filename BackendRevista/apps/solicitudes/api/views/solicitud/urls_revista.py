from django.urls import path
from .views_revista import RevistaList, RevistaDetail

urlpatterns = [
    path('revista/', RevistaList.as_view(), name='revista_list'),
    path('revista/<int:pk>/', RevistaDetail.as_view(), name='revista_detail'),
]