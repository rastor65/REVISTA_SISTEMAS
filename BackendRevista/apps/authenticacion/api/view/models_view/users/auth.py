from django.http import HttpResponse
from django.http import JsonResponse
from django.dispatch import receiver
from django.shortcuts import render
from django.core.mail import send_mail
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.hashers import make_password
from django_rest_passwordreset.signals import reset_password_token_created

from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView, UpdateAPIView, RetrieveAPIView
from rest_framework_simplejwt.tokens import RefreshToken, TokenError
from django.contrib.auth.hashers import check_password, make_password

from .....models import CustomUser
from .....mudules import create_response
from helps.flatList import flatList
from ....serializer.authserializer import UserSerializer, CreateUserSerializers, UserChangePassword, CustomUserSerializer, PasswordChangeSerializer
from apps.authenticacion.api.serializer.auth_serializer import LoginSerializers,RegistroSerializzer, RegisterSerializers, RegisterUserSerializer
from apps.authenticacion.api.serializer.serializers import ResourcesSerializers, ResourcesRolesSerializers

import bcrypt, logging
from django.shortcuts import get_object_or_404
from django.http import FileResponse

##  USER ##
class CustomUserList(generics.ListCreateAPIView):
    queryset = CustomUser.objects.filter(is_active=True)
    serializer_class = CustomUserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Hashear la contraseña antes de guardar el usuario
            password = make_password(request.data['password'])
            serializer.save(password=password)
            response_data = {
                "ok": True,
                "message": "User Create",
                "data": serializer.data,
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        response_data = {
            "ok": False,
            "message": "Error",
            "errors": serializer.errors,
        }
        return Response(response_data, status=status.HTTP_400_BAD_REQUEST)

# class CustomLogEntryListCreateView(generics.ListCreateAPIView):
#     queryset = CustomLogEntry.objects.all()
#     serializer_class = CustomLogEntrySerializer

def descargar_archivo(request, pk):
    contenido = get_object_or_404(CustomUser, pk=pk, is_active=True)
    archivo = contenido.avatar
    response = FileResponse(archivo)
    return response

class UserDetail(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    def retrieve(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            if instance.is_active:
                serializer = self.get_serializer(instance)
                return Response(serializer.data)
            else:
                response_data = {
                    "ok": False,
                    "message": "Usuario no encontrado",
                    "errors": {"error": ["Usuario no encontrado"]},
                }
                return Response(response_data, status=status.HTTP_404_NOT_FOUND)
        except CustomUser.DoesNotExist:
            response_data = {
                "ok": False,
                "message": "Usuario no encontrado",
                "errors": {"error": ["Usuario no encontrado"]},
            }
            return Response(response_data, status=status.HTTP_404_NOT_FOUND)

class ChangePasswordView(generics.UpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = PasswordChangeSerializer

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        serializer = self.get_serializer(data=request.data)

        if serializer.is_valid():
            current_password = serializer.data.get("current_password")
            new_password = serializer.data.get("new_password")

            # Verifica que la contraseña actual es correcta
            if not check_password(current_password, user.password):
                return Response({"current_password": ["La contraseña actual es incorrecta."]},
                                status=status.HTTP_400_BAD_REQUEST)

            # Cambia la contraseña
            user.password = make_password(new_password)
            user.save()

            return Response({"message": "Contraseña actualizada con éxito"})

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
class UserPublic(generics.RetrieveAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    def retrieve(self, request, *args, **kwargs):
        users = self.get_queryset()
        serializers = UserSerializer(users, many=True)
        response_data = {
            "ok": True,
            "message": "Users Public",
            "data": serializers.data,
        }
        return Response(response_data, status=status.HTTP_200_OK)
    
class UserCreate(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = CreateUserSerializers

    def create(self, request, *args, **kwargs):
        userSerializers = self.get_serializer(data=request.data)
        if userSerializers.is_valid():
            # Hashear la contraseña antes de guardar el usuario
            password = make_password(request.data['password'])
            userSerializers.save(password=password)
            response_data = {
                "ok": True,
                "message": "User Create",
                "data": userSerializers.data,
            }
            return Response(response_data, status=status.HTTP_201_CREATED)
        response_data = {
            "ok": False,
            "message": "Error",
            "errors": userSerializers.errors,
        }
        return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
    
class UserUpdate(generics.UpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    def get_object(self):
        try:
            request_user = self.kwargs['pk']
            user = CustomUser.objects.get(pk=request_user)
            return user
        except CustomUser.DoesNotExist:
            return None
        
    def get(self, request, *args, **kwargs):
        user = self.get_object()

        if user is None:
            response_data = {
                "ok": False,
                "message": "Usuario no encontrado",
                "errors": {"error": ["Usuario no encontrado"]},
            }
            return Response(response_data, status=status.HTTP_404_NOT_FOUND)

        user_serializer = UserSerializer(user)
        response_data = {
            "ok": True,
            "data": user_serializer.data
        }
        return Response(response_data, status=status.HTTP_200_OK)

    def update(self, request, *args, **kwargs):
        user = self.get_object()

        if user is None:
            response_data = {
                "ok": False,
                "message": "Usuario no encontrado",
                "errors": {"error": ["Usuario no encontrado"]},
            }
            return Response(response_data, status=status.HTTP_404_NOT_FOUND)

        user_serializer = UserSerializer(
            user, data=request.data, partial=kwargs.get('partial', False))
        
        if user_serializer.is_valid():
            user_serializer.save()
            response_data = {
                "ok": True,
                "message": "Usuario actualizado exitosamente",
            }
            return Response(response_data)
        else:
            response_data = {
                "ok": False,
                "message": "Error de validación",
                "errors": user_serializer.errors,
            }
            return Response(response_data, status=status.HTTP_400_BAD_REQUEST)
        
class UserChangePasswordView(UpdateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = UserSerializer

    def get_object(self):
        try:
            request_user = self.kwargs['pk']
            user = CustomUser.objects.get(pk=request_user)
            return user
        except (CustomUser.DoesNotExist, TypeError):
            return None
        except (BaseException, TypeError) as e:
            return None

    def perform_update(self, serializer):
        if 'original-password' in self.request.data:
            password = self.request.data['password'].encode('utf-8')
            hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())
            serializer.save(password=hashed_password.decode('utf-8'))
        else:
            serializer.save()

    def patch(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        user = self.get_object()

        if user is None:
            response, code = create_response(
                status.HTTP_400_BAD_REQUEST, 'Not Found', e.args)
            return Response(response, status=code)

        if 'original-password' not in self.request.data:
            response, code = create_response(
                status.HTTP_400_BAD_REQUEST, 'Password Error', 'Password not found')
            return Response(response, status=code)

        if not user.check_password(request.data['original-password']):
            response, code = create_response(
                status.HTTP_400_BAD_REQUEST, 'Password Error', 'Password is not correct.')
            return Response(response, status=code)

        userSerializers = UserChangePassword(
            user, data=request.data, partial=partial, context={'context': request})

        try:
            if userSerializers.is_valid():
                self.perform_update(userSerializers)
                response, code = create_response(
                    status.HTTP_200_OK, 'Password', 'Password Change')
                return Response(response, status=code)
            return Response(userSerializers.errors, status=status.HTTP_400_BAD_REQUEST)
        except (AttributeError, Exception) as e:
            response, code = create_response(
                status.HTTP_400_BAD_REQUEST, 'Not Found', e.args)
            return Response(response, status=code)

class AuthLogin(APIView):
    
    def get_tokens_for_user(self, user):
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }

    def post(self, request, *args, **kwargs):
        data = {}
        if 'email' in request.data:
            data['username'] = request.data['email']
            data['password'] = request.data['password']
        else:
            data = request.data

        serializers = LoginSerializers(
            data=data, context={'request': self.request})
        if not serializers.is_valid():
            response, code = create_response(
                status.HTTP_400_BAD_REQUEST, 'Error', serializers.errors)
            return Response(response, status=code)

        login(request, serializers.validated_data)
        token = self.get_tokens_for_user(serializers.validated_data)

        """
            Obtiene y aplana la lista de recursos relacionados con los roles del usuario autenticado.

            Esta línea de código recupera los recursos relacionados con los roles del usuario autenticado,
            los cuales están almacenados en la propiedad 'resources' de los objetos 'Role'. Luego, utiliza
            el método 'prefetch_related' para optimizar las consultas y obtener los recursos de manera eficiente.

            Args:
                serializers.validated_data.roles.all(): Los roles asociados al usuario autenticado.

            Returns:
                list: Una lista plana de recursos relacionados con los roles del usuario.
        """
        resources = flatList([e.resources.prefetch_related(
            'resources') for e in serializers.validated_data.roles.all()])
   
        menu = ResourcesSerializers(set(resources), many=True)

        request.session['refresh-token'] = token['refresh']
        response, code = create_response(
            status.HTTP_200_OK, 'Login Success', {'token': token, 'user': {'name': serializers.validated_data.username,
                                                                           'id': serializers.validated_data.id},
                                                  'menu': menu.data})
        return Response(response, status=code)
    
class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    http_method_names = ['get', 'patch']

    def get_object(self):
        if self.request.user.is_authenticated:
            return self.request.user

class RegistroView(APIView):
    def post(self, request):
        serializer = RegistroSerializzer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({'message': 'Registro exitoso'}, status=201)
        return Response(serializer.errors, status=400)
      
class LogoutView(APIView):
    def get(self, request, *args, **kwargs):
        try:
            jwt_token = request.session.get('refresh-token', None)
            resp = HttpResponse('content')
            resp.cookies.clear()
            resp.flush()
            token = RefreshToken(jwt_token)
            token.blacklist()
            logout(request)
            request.session.clear()
            resp.flush()
            request.session.flush()
            response, code = create_response(
                status.HTTP_200_OK, 'Logout Success', 'Ok')
            return Response(response, code)
        except TokenError as TkError:
            response, code = create_response(
                status.HTTP_400_BAD_REQUEST, 'Error', f'{TkError}')
            return Response(response, code)
        except Exception as e:
            response, code = create_response(
                status.HTTP_400_BAD_REQUEST, 'Error', e)
            return Response(e.args, code)

@receiver(reset_password_token_created)
def password_reset_token_created(sender, instance, reset_password_token, *args, **kwargs):
    print(f"\nRecupera la contraseña del correo '{reset_password_token.user.email}' usando el token '{reset_password_token.key}'")
