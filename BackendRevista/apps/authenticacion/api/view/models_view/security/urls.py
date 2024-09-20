from django.urls import path

from .security import SecurityResourcesCreate, SecurityRolesUser

urlpatterns = [
    path('create/roles/resources/', SecurityResourcesCreate.as_view()),
    path('create/roles/user/', SecurityRolesUser.as_view())
]
