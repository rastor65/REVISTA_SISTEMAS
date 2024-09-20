from rest_framework.permissions import BasePermission

class IsAdminRole(BasePermission):

    def has_permission(self, request, view):
        if request.user and request.user.is_staff:
            return True

        if request.user.roles.all().filter(name='Admin'):
            return True

        return False
