from django.contrib import admin
from django.contrib.auth import get_user_model
from django.contrib.auth.admin import UserAdmin
from .models import Person, Gender, DocumentType, Resource,  ResourceRol, Rol, UserRol, CustomUser
from .models import NivelFormacion, Formacion

from django.contrib.auth.models import Group  


admin.site.register(Person)
admin.site.register(Gender)
admin.site.register(DocumentType)
admin.site.register(Resource)
admin.site.register(ResourceRol)
admin.site.register(Rol)
admin.site.register(UserRol)
admin.site.register(NivelFormacion)
admin.site.register(Formacion)

@admin.register(get_user_model())
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('Información personal', {'fields': ('first_name', 'last_name', 'email')}),
        ('Permisos', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Fechas importantes', {'fields': ('last_login', 'date_joined')}),
    )
    list_filter = ('is_staff', 'is_superuser', 'is_active', 'groups')
    search_fields = ('username', 'first_name', 'last_name', 'email')

admin.site.unregister(Group)  


# class CustomLogEntryAdmin(admin.ModelAdmin):
#     list_display = ('action_time', 'user', 'content_type', 'object_id', 'object_repr', 'action_flag', 'change_message')
#     list_filter = ('action_flag',)
#     search_fields = ('user__username',)
#     date_hierarchy = 'action_time'
#     ordering = ('-action_time',)

# admin.site.register(CustomLogEntry, CustomLogEntryAdmin)




