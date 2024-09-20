from rest_framework import serializers
from ....models import Pqrs,Respuesta,Anexo
from ..BaseSerializers import BaseSerializers

class RespuestaSerializers(BaseSerializers):
    pqrs = serializers.SlugRelatedField("description",read_only=True)
    anexo = serializers.SlugRelatedField("nombre_ane",read_only=True)
    descripcion = serializers.CharField()
    
    class Meta:
        fields = "__all__"

    def create(self, validated_data):
        try:
            anexo = Anexo.objects.get(pk=validated_data["anexo"])
            pqrs = Pqrs.objects.get(pk=validated_data["pqrs"])
            userCreate = None
            if "userCreate" in validated_data:
                userCreate = validated_data["userCreate"]
            return Respuesta.objects.create(descripcion=validated_data["descripcion"],anexo=anexo,pqrs=pqrs,userCreate=userCreate)
        except (Anexo.DoesNotExist,Pqrs.DoesNotExist) as e:
            raise serializers.ValidationError(e.args[0])

    def update(self, instance, validated_data):
        try:
            anexo = Anexo.objects.get(pk=validated_data["anexo"])
            instance.anexo = anexo
            instance.userUpdate = validated_data.get("userUpdate",instance.userUpdate)
            instance.save()
            return instance
        except Anexo.DoesNotExist as e:
            raise serializers.ValidationError(e.args[0])


class RespuestaPqrsSerializers(BaseSerializers):
    anexo = serializers.SlugRelatedField("nombre_ane",read_only=True)
    descripcion = serializers.CharField()
    
    class Meta:
        fields = "__all__"