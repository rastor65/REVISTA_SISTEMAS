from rest_framework import serializers
from ....models import *
        
class ContenidoSolicitudSerializer(serializers.ModelSerializer):
    archivo_adjunto = serializers.FileField()
    declaracion_originalidad = serializers.FileField()
    
    class Meta:
        model = ContenidoSolicitud
        fields = '__all__'

