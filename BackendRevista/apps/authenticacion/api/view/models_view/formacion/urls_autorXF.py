from django.urls import path
from .views_autorXF import FormacionList, FormacionDetail, descargar_cert_grado

urlpatterns = [
    path('formacion/', FormacionList.as_view()),
    path('formacion/<int:pk>/', FormacionDetail.as_view()),
    path('formacion/<int:pk>/descargar/cert_grado/', descargar_cert_grado, name='descargar-cert-grado'),
]
