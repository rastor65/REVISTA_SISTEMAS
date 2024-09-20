from .....mudules import path
from .roles import *

urlpatterns = [
    path('', RolList.as_view()),
    path('<int:pk>', RolDetail.as_view()),
    #### URLS ROLES VIEWS ####
    path('user_rol/', UserRolList.as_view(), name='user_roles_list'),
    path('user_rol/<int:pk>/', UserRolDetail.as_view(), name='user_roles_detail'),
]


