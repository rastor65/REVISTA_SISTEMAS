from django.urls import path
from .view import PqrsView,SavePqrsView,UpdatePqrsView,DeletePqrsView

urlpatterns = [
    path("",PqrsView.as_view()),
    path("create/",SavePqrsView.as_view()),
    path("update/<int:pk>/",UpdatePqrsView.as_view()),
    path("delete/<int:pk>/",DeletePqrsView.as_view()),
]
