#from django.shortcuts import redirect
##from apps.authenticacion.models import CustomUser
#
#class RoleMiddleware:
#    def __init__(self, get_response):
#        self.get_response = get_response
#
#    def __call__(self, request):
#        if request.CustomUser.is_authenticated:
#            role = request.CustomUser.role
#
#            allowed_roles = [
#                'Administrador',
#                'Jefe Editor',
#                'Editor',
#                'Evaluador',
#                'Autor',
#                'Editor invitado',
#                'Asistente editorial'
#            ]
#
#            if role in allowed_roles:
#                return self.get_response(request)
#            else:
#                # Redirige a una página de acceso denegado o cualquier otra página que desees mostrar
#                return redirect('access_denied')  # Reemplaza 'access_denied' por la URL de tu página de acceso denegado
#        else:
#            # Redirige a la página de inicio de sesión
#            return redirect('login')  # Reemplaza 'login' por la URL de tu página de inicio de sesión
#from django.contrib.auth import get_user
#
#class RoleMiddleware:
#    def __init__(self, get_response):
#        self.get_response = get_response
#
#    def __call__(self, request):
#        if user := get_user(request):
#            if user.is_authenticated:
#                role = user.role
#                # Resto del código...
#        return self.get_response(request)
#
#
#