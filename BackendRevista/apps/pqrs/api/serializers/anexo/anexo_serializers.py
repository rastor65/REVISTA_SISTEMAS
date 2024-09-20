from rest_framework import serializers
from ....models import Anexo
from ..BaseSerializers import BaseSerializers

class AnexoSerializers(BaseSerializers):
    nombre_ane = serializers.CharField()

    class Meta:
        fields = "__all__"

    def create(self, validated_data):
        userCreate = None
        if "userCreate" in validated_data:
            userCreate = validated_data["userCreate"]
        return Anexo.objects.create(nombre_ane=validated_data["nombre_ane"],userCreate=userCreate)

    def update(self, instance, validated_data):
        instance.nombre_ane = validated_data.get('nombre_ane', instance.nombre_ane)
        instance.userUpdate = validated_data.get("userUpdate",instance.userUpdate)
        instance.save()
        return instance
