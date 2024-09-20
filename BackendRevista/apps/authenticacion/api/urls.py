from django.urls import path, include

urlpatterns = [
    path('roles/', include('apps.authenticacion.api.view.models_view.roles.urls')),
    path('resources/', include('apps.authenticacion.api.view.models_view.resources.urls')),
    path('resourcesr/', include('apps.authenticacion.api.view.models_view.resources.urlss')),
    path('persons/', include('apps.authenticacion.api.view.models_view.persons.urls')),
    path('genders/', include('apps.authenticacion.api.view.models_view.gender.urls')),
    path('documents/', include('apps.authenticacion.api.view.models_view.documents.urls')),
    path('security/',include('apps.authenticacion.api.view.models_view.security.urls')), 
    path('formacion/', include('apps.authenticacion.api.view.models_view.formacion.urls_autorXF')),
    path('nivel_f/', include('apps.authenticacion.api.view.models_view.formacion.urls_nivelF')),
]