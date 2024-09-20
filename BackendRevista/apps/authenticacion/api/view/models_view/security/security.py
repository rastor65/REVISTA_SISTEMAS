from rest_framework.generics import CreateAPIView
from ....serializer.serializers import ResourcesRolesSerializers, RolesUserSerializers, RolesSerializers
from rest_framework import status
from apps.authenticacion.models import Resource, UserRol, Rol
from rest_framework.response import Response
from .....mudules import create_response


class SecurityResourcesCreate(CreateAPIView):
    queryset = Resource.objects.all()
    serializer_class = ResourcesRolesSerializers

    def post(self, request, *args, **kwargs):
        try:
            resources = ResourcesRolesSerializers(data=request.data)
            resources.is_valid(raise_exception=True)
            resources.create(request.data)
            response, code = create_response(
                status.HTTP_200_OK, 'Resources', 'Resources Create')
            return Response(response, code)
        except BaseException as e:
            response, code = create_response(
                status.HTTP_400_BAD_REQUEST, 'Error', e.args[0])
            return Response(response, status=code)

class SecurityRolesUser(CreateAPIView):
    queryset = UserRol.objects.all()
    serializer_class = RolesUserSerializers

    def post(self, request, *args, **kwargs):
        user = request.data['user']
        rolesId = request.data['roles']
        roles = Rol.objects.filter(id__in=rolesId)

        rolesUser = RolesUserSerializers(
            data={'userId': user})

        if rolesUser.is_valid():
            rolesUser.save(roles=roles)
            response, code = create_response(
                status.HTTP_200_OK, 'User-Rol', 'successfully assigned roles')
            return Response(response, status=code)
        response, code = create_response(
            status.HTTP_400_BAD_REQUEST, 'Error', rolesUser.errors)
        return Response(response, status=code)
