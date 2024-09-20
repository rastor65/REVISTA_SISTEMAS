from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model
from django.db.models import Q
from django.views.decorators.debug import sensitive_variables

UserModel = get_user_model()

class EmailBackend(ModelBackend):
    
    def authenticate(self, request, username=None, password=None, **kwargs):
        try:
            # Buscar el usuario por nombre de usuario o correo electrónico
            user = UserModel.objects.get(
                Q(username__iexact=username) | Q(email__iexact=username))
        except UserModel.DoesNotExist:
            return None

        # Verificar la contraseña y la elegibilidad para autenticarse
        if user.check_password(password) and self.user_can_authenticate(user):
            return user
        return None

    def get_user(self, user_id):
        try:
            return UserModel.objects.get(pk=user_id)
        except UserModel.DoesNotExist:
            return None

