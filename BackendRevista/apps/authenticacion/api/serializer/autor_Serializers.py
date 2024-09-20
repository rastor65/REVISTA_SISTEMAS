from rest_framework import serializers
from ...models import *
from apps.solicitudes.api.serializers.solicitud.solicitud_serializers import *
from .authserializer import CustomUserSerializer
 
class NivelFormacionSerializer(serializers.ModelSerializer):
    class Meta:
        model = NivelFormacion
        fields = '__all__'     

class FormacionSerializer(serializers.ModelSerializer):

    class Meta:
        model = Formacion
        fields = '__all__'

class AutorSerial(serializers.ModelSerializer):
    usuarioxformacion = FormacionSerializer(many=True) 
    usuario = serializers.PrimaryKeyRelatedField(
        queryset=get_user_model().objects.all(),
        default=serializers.CurrentUserDefault()
    )

    class Meta:
        model = CustomUser
        fields = '__all__'


        
   

