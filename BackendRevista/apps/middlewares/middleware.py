from django.http import HttpResponseForbidden
from apps.authenticacion.models import CustomUser, Rol, Resource, UserRol, ResourceRol
from django.core.exceptions import ObjectDoesNotExist  

class ServiceMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        url = request.path_info
        print(url)
        if request.user and not request.user.is_anonymous:
            idUsuario = CustomUser.objects.get(email = request.user)
            print(idUsuario.id)
            rolUsuario = UserRol.objects.filter(userId = idUsuario.id).values('rolesId')
            print(rolUsuario)
            
            role_recursos = Resource.objects.all().prefetch_related('roles').values('path','titulo','roles').filter(roles__in= (rolUsuario))
            
            sw = 0  
            for rolerec in role_recursos:
                if url in rolerec['path']:
                    sw = 1  
                    break
            
            if sw == 0:
                return HttpResponseForbidden("Acceso denegado. El usuario no tiene acceso a esta ruta.")
                                        
        print(url)
        response = self.get_response(request)
        return response

    def get_user_resources(self, user_roles):
        user_resources = []
        for role in user_roles:
            resources = Resource.objects.filter(roles__pk=role).values_list('path', flat=True)
            user_resources.extend(resources)
        return user_resources

