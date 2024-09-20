from rest_framework import serializers
from ....models import Asignacion, Pqrs
from apps.authenticacion.models import CustomUser
from ..BaseSerializers import BaseSerializers

class AsignacionSerializers(BaseSerializers):
    revistaId = serializers.SlugRelatedField("username",read_only=True)
    pqrs = serializers.SlugRelatedField("description",read_only=True)


    class Meta:
        fields = "__all__"

    def create(self, validated_data):
        try:
            revistaId = CustomUser.objects.get(pk=validated_data["revistaId"])
            pqrs = Pqrs.objects.get(pk=validated_data["pqrs"])
            userCreate = None
            if "userCreate" in validated_data:
                userCreate = validated_data["userCreate"]
            return Asignacion.objects.create(revistaId=revistaId,pqrs=pqrs,userCreate=userCreate)
        except (CustomUser.DoesNotExist,Pqrs.DoesNotExist) as e:
            raise serializers.ValidationError(e.args[0])

    def update(self, instance, validated_data):
        try:
            newrevistaId = CustomUser.objects.get(pk=validated_data["revistaId"])
            instance.revistaId = newrevistaId
            instance.userUpdate = validated_data.get("userUpdate",instance.userUpdate)
            instance.save()
            return instance
        except CustomUser.DoesNotExist as e:
            raise serializers.ValidationError(e.args[0])
    
    
        
