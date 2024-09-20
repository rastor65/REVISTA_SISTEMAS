from rest_framework import serializers
from ....models import *

from .....authenticacion.models import CustomUser
from ..solicitud.solicitud_serializers import *

        
class SeguimientoSerializer(serializers.ModelSerializer):
    #solicitud = serializers.PrimaryKeyRelatedField(queryset=Solicitud.objects.all())
    #pasos_seguimiento = serializers.PrimaryKeyRelatedField(queryset=PasosSeguimiento.objects.all())

    class Meta:
        model = Seguimiento
        fields = '__all__'
        
class AnexosSerializer(serializers.ModelSerializer):
    class Meta:
        model = Anexos
        fields = '__all__'

class EstadoSeguimientoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EstadoSeguimiento
        fields = '__all__'
