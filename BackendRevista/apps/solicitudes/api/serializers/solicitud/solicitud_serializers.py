from rest_framework import serializers
from ....models import *

from django import forms
from apps.authenticacion.api.serializer.authserializer import CustomUserSerializer
from .....authenticacion.models import CustomUser
    
class SolicitudSerializer(serializers.ModelSerializer):
    fecha_asignacion = forms.DateField(input_formats=['%Y-%m-%d'])
    fecha_programacion = forms.DateField(input_formats=['%Y-%m-%d'])
    fecha_evaluacion = forms.DateField(input_formats=['%Y-%m-%d'])
    
    class Meta:
        model = Solicitud
        fields = '__all__'
        verbose_name = 'Solicitud'
        extra_kwargs = {
            'autores': {'required': True}
        }
        
class PasosSeguimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = PasosSeguimiento
        fields = '__all__'
        verbose_name = 'PasosSolicitud'
        
class RevistaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Revista
        fields = '__all__'
        verbose_name = 'Revista'
        

