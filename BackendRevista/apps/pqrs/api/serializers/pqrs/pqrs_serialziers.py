from rest_framework import serializers
from ....models import Pqrs,CustomUser,TipoPqrs
from ..BaseSerializers import BaseSerializers

class PqrsSerializers(BaseSerializers):
    titulo = serializers.CharField()
    description = serializers.CharField()
    persona = serializers.SlugRelatedField("username",read_only=True)
    tipopqrs = serializers.SlugRelatedField("tipo",read_only=True)

    class Meta:
        fields = "__all__"

    def create(self, validated_data):
        try:
            persona = CustomUser.objects.get(pk=validated_data["persona"])
            tipo = TipoPqrs.objects.get(pk=validated_data["tipo"])
            userCreate = None
            if validated_data["userCreate"]:
                userCreate = validated_data["userCreate"]
            return Pqrs.objects.create(description=validated_data["description"],titulo=validated_data["titulo"],tipopqrs=tipo,persona=persona,userCreate=userCreate)
        except (CustomUser.DoesNotExist,TipoPqrs.DoesNotExist) as e:
            raise serializers.ValidationError(e.args)

    def update(self, instance, validated_data):
        instance.titulo = validated_data.get('titulo', instance.titulo)
        instance.description = validated_data.get('description', instance.description)
        instance.userUpdate = validated_data.get("userUpdate",instance.userUpdate)
        instance.save()
        return instance


class PqrsRespuestaSerializers(BaseSerializers):
    titulo = serializers.CharField()
    description = serializers.CharField()

    class Meta:
        fields = "__all__"