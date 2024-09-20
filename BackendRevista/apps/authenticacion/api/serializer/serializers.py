from rest_framework import serializers
from apps.authenticacion.models import (DocumentType, Gender, Person, Resource, Rol, CustomUser, 
                       UserRol, ResourceRol)
from django import forms

from rest_framework.serializers import ModelSerializer, CharField, ValidationError, Serializer, IntegerField
from django.utils import timezone
from ...mudules import create_response, menuResources


class UserSerializersSimple(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ('username', 'email')
        
class UserSerialSimple(ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'
    
#GENDER
class GenderSerializers(ModelSerializer):
    name = CharField()
    class Meta:
        model = Gender
        exclude = ('createdAt', 'updateAt')
        
#DOCUMENT
class DocumentSerializers(ModelSerializer):
    class Meta:
        model = DocumentType
        fields = '__all__'   
                 
#PERSON

class PersonsSerializers(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = '__all__'

class PersonsSimpleSerializers(ModelSerializer):
    document_type = DocumentSerializers(read_only=True)

    class Meta:
        model = Person
        fields = ('name', 'surname', 'document_type',
                  'phone', 'status', 'date_of_birth')     
      
#RESOURCES
class ResourcesSerializers(ModelSerializer):
    class Meta:
        model = Resource
        exclude = ('roles',)     
        
class ResourcesRolesSerializers(serializers.ModelSerializer):
    class Meta:
        model = ResourceRol
        fields = '__all__'     

class Resources_RolesSerializers(serializers.ModelSerializer):
    class Meta:
        model = ResourceRol
        fields = '__all__'
        
    rolesId = IntegerField()
    resources = ResourcesSerializers(many=True)

    def create(self, validated_data):
        try:
            resources = []
            list_resources_roles = []

            id_last_resources = 0
            last = Resource.objects.last()
            if last:
                id_last_resources = last.id + 1

            menuResources(validated_data['resources'],
                          resources, Resource, id_last_resources)
            resources = Resource.objects.bulk_create(resources)
            roles = Rol.objects.get(pk=validated_data['rolesId'])
            list_resources_roles = [ResourceRol(
                rolesId=roles, resourcesId=r) for r in resources]
            ResourceRol.objects.bulk_create(list_resources_roles)
            return None
        except Exception as e:
            raise e

#ROLES

class RolesSerializers(ModelSerializer):
    userId = UserSerialSimple(read_only=True)
    
    class Meta:
        model = Rol
        fields = '__all__'
              
class RolesSimpleSerializers(ModelSerializer):
    resources = ResourcesSerializers(many=True)

    class Meta:
        model = UserRol
        fields = '__all__'

class RolesUserSerializers(serializers.ModelSerializer):
    userId = UserSerialSimple(read_only=True)
    rolesId = RolesSerializers(read_only=True)

    class Meta:
        model = UserRol
        fields = ['id', 'status', 'userId', 'rolesId']
        read_only_fields = ['userId', 'rolesId']

    def create(self, validated_data):
        user = validated_data['userId']
        rolesForUser = [UserRol(
            userId=user, rolesId=x) for x in validated_data['roles']]

        try:
            response = UserRol.objects.bulk_create(rolesForUser)
            return response[0]
        except Exception as e:
            response, code = create_response(
                404, '', 'Duplicate Key User - Rol')
            raise ValidationError(response, code=code)
  
class UserRolSerializer(serializers.ModelSerializer):
    userId = UserSerialSimple()
    rolesId = RolesSerializers()

    class Meta:
        model = UserRol
        fields = '__all__'
        
class UserRolesSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserRol
        fields = '__all__'
  
class UserSerial(ModelSerializer):
    rolesId = RolesSerializers(read_only=True, source='rolesId.roles')
    
    class Meta:
        model = CustomUser
        fields = '__all__'
        
    def __str__(self):
        return self.rolesId.name