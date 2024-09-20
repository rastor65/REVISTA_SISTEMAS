from django.urls import path, include
from .api.view.models_view.users.auth import (CustomUserList,UserDetail,UserPublic,
                    UserCreate,UserUpdate,ProfileView,  
                    RegistroView,AuthLogin, LogoutView,UserChangePasswordView, ChangePasswordView
                    ,descargar_archivo)

urlpatterns = [
    # Auth views
    path('registro/', RegistroView.as_view(), name='registro'),
    path('auth/login/', AuthLogin.as_view(), name='auth_login'),
    path('auth/logout/', LogoutView.as_view(), name='auth_logout'),
    
    # # User 
    # path('logs/', CustomLogEntryListCreateView.as_view(), name='log-list-create'),
    path('user/', CustomUserList.as_view(), name='customuser-list'),
    path('user/<int:pk>/descargar/', descargar_archivo, name='descargar-archivo'),
    path('user/<int:pk>/', UserDetail.as_view(), name='user-detail'),
    path('user/<int:pk>/change-password/', ChangePasswordView.as_view(), name='change-password'),
    path('user/createview/', UserCreate.as_view(), name='user_createview'),
    path('user/update/<int:pk>/', UserUpdate.as_view(), name='user_createview'),
    
    path('user/profile/', ProfileView.as_view(), name='user_profile'),
    
    #User Publico
    path('user/viewpublic/', UserPublic.as_view(), name='user_viewpublic'),
    
    path('<int:pk>/change/password/', UserChangePasswordView.as_view(), name='user_changepassword'),   
    path('auth/reset/', include('django_rest_passwordreset.urls',
                 namespace='password_reset')),
]
