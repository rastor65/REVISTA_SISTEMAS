from rest_framework import serializers
from ....models import Asignaciones

class AsignacionesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Asignaciones
        fields = '__all__'
