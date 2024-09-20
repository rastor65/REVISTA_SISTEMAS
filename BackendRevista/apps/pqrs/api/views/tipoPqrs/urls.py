from django.urls import path
from .view import DeleteTipoPqrsView,SaveTipoPqrsView,TipoPqrsView,UpdatePqrsView

urlpatterns = [
    path("",TipoPqrsView.as_view()),
    path("create/",SaveTipoPqrsView.as_view()),
    path("update/<int:pk>/",UpdatePqrsView.as_view()),
    path("delete/<int:pk>/",DeleteTipoPqrsView.as_view()),
]
