from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from apps.authenticacion.models import Resource, Rol, ResourceRol
from ....serializer.serializers import ResourcesSerializers, ResourcesRolesSerializers

class ResourceList(generics.ListCreateAPIView):
    queryset = Resource.objects.filter(status=True)
    serializer_class = ResourcesSerializers

class ResourceDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourcesSerializers

    def perform_destroy(self, instance):
        # Cambia el estado booleano en lugar de eliminar el objeto
        instance.status = False
        instance.save()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance is None:
            response = {'response': 'Resource Not Found'}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

        # Check if status is True before changing it
        if instance.status:
            self.perform_destroy(instance)
            response = {'response': 'Resource hidden successfully'}
            return Response(response, status=status.HTTP_204_NO_CONTENT)
        else:
            response = {'response': 'Resource is already hidden'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)


########### RECURSOS ROLES ############

class ResourceRolList(generics.ListCreateAPIView):
    queryset = ResourceRol.objects.filter(status=True)
    serializer_class = ResourcesRolesSerializers

class ResourceRolDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = ResourceRol.objects.all()
    serializer_class = ResourcesRolesSerializers

    def perform_destroy(self, instance):
        # Cambia el estado booleano en lugar de eliminar el objeto
        instance.status = False
        instance.save()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance is None:
            response = {'response': 'Resource Role Not Found'}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

        # Check if status is True before changing it
        if instance.status:
            self.perform_destroy(instance)
            response = {'response': 'Resource Role hidden successfully'}
            return Response(response, status=status.HTTP_204_NO_CONTENT)
        else:
            response = {'response': 'Resource Role is already hidden'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)