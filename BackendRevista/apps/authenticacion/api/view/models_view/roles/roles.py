from apps.authenticacion.models import Rol, UserRol
from rest_framework import generics
from rest_framework.views import APIView
from ....serializer.serializers import RolesSerializers, UserRolesSerializer, RolesUserSerializers, UserRolSerializer
from .....mudules import (Response, create_response, status)

class RolList(generics.ListCreateAPIView):
    queryset = Rol.objects.filter(status=True)
    serializer_class = RolesSerializers

class RolDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Rol.objects.all()
    serializer_class = RolesSerializers

    def perform_destroy(self, instance):
        # Cambia el estado booleano en lugar de eliminar el objeto
        instance.status = False
        instance.save()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance is None:
            response = {'response': 'Rol Not Found'}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

        # Check if status is True before changing it or deleting
        if instance.status:
            self.perform_destroy(instance)
            response = {'response': 'Rol hidden successfully'}
            return Response(response, status=status.HTTP_204_NO_CONTENT)
        else:
            response = {'response': 'Rol is already hidden'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

### USER ROL ###

class UserRolList(APIView):
    
    def get(self, request, format=None):
        user_roles = UserRol.objects.filter(status=True).select_related('userId', 'rolesId')
        serializer = UserRolSerializer(user_roles, many=True)
        return Response(serializer.data)
    
    def post(self, request, format=None):
        user_id = request.data.get('userId')
        role_id = request.data.get('rolesId')

        existing_user_rol = UserRol.objects.filter(userId=user_id, rolesId=role_id, status=True).first()

        if existing_user_rol:
            return Response({"message": "La relación ya existe"}, status=status.HTTP_400_BAD_REQUEST)
        else:
            user_rol = UserRol.objects.create(userId_id=user_id, rolesId_id=role_id, status=True)
            serializer = UserRolSerializer(user_rol)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
    
class UserRolDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = UserRol.objects.filter(status=True)
    serializer_class = RolesUserSerializers

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        
        if serializer.is_valid():
            # Realizar la actualización solo si el estado es True
            if instance.status:
                serializer.save()
                response = {'response': 'User Role updated successfully', 'data': serializer.data}
                return Response(response, status=status.HTTP_200_OK)
            else:
                response = {'response': 'User Role is hidden and cannot be updated'}
                return Response(response, status=status.HTTP_400_BAD_REQUEST)
        else:
            response = {'response': 'Error', 'errors': serializer.errors}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)

    def perform_destroy(self, instance):
        # Cambia el estado booleano en lugar de eliminar el objeto
        instance.status = False
        instance.save()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance is None:
            response = {'response': 'User Rol Not Found'}
            return Response(response, status=status.HTTP_404_NOT_FOUND)

        # Check if status is True before changing it or deleting
        if instance.status:
            self.perform_destroy(instance)
            response = {'response': 'User Rol hidden successfully'}
            return Response(response, status=status.HTTP_204_NO_CONTENT)
        else:
            response = {'response': 'User Rol is already hidden'}
            return Response(response, status=status.HTTP_400_BAD_REQUEST)


