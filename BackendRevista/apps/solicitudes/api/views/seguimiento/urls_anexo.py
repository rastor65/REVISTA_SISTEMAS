# urls.py
from django.urls import path
from .views_anexo import AnexosList, AnexosDetail

urlpatterns = [
    path('anexos/', AnexosList.as_view()),
    path('anexos/<int:pk>/', AnexosDetail.as_view()),
]
