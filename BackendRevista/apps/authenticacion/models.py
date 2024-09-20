from django.contrib.auth.models import AbstractUser
from django.db import models
from django.contrib.auth.models import UserManager
# from django.contrib.admin.models import LogEntry

class CustomUser(AbstractUser):
    username = models.CharField(max_length=45, null=False)
    email = models.EmailField(
        "email address", blank=False, null=False, unique=True)
    password = models.CharField(max_length=100)
    resetToken = models.CharField(max_length=190, blank=True, null=True)
    avatar = models.ImageField(upload_to='archivos/archivos_useravatar/', blank=True, null=True)
    roles = models.ManyToManyField(
        'Rol', through='UserRol', related_name='users_customuser'
    )
    objects = UserManager()
    
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']
    
def path_to_avatar(instance, filename):              
    return f'avatars/{instance.id}/{filename}'

class BaseModel(models.Model):
    createdAt = models.DateField(auto_now_add=True)
    updateAt = models.DateField(auto_now=True, blank=True, null=True)

    class Meta:
        abstract = True
    
class DocumentType(BaseModel):
    name = models.CharField(max_length=100)
    status = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = 'Document Type'
        verbose_name_plural = 'Document Types'
        
class Gender(BaseModel):
    name = models.CharField(max_length=100)
    status = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = 'Genders'
        verbose_name_plural = 'Genders'    

class Rol(BaseModel):
    name = models.CharField(max_length=190, unique=True)
    status = models.BooleanField(default=True)
    users = models.ManyToManyField(
        CustomUser, through='UserRol', related_name='roles_rol'
    )
    resources = models.ManyToManyField(
        'Resource', through='ResourceRol', related_name='roles_resource'
    )

    def __str__(self) -> str:
        return self.name

    class Meta:
        verbose_name = 'Rols'
        verbose_name_plural = 'rols'

class Person(BaseModel):
    nombres = models.CharField(max_length=150, blank=True, null=True)
    apellidos = models.CharField(max_length=150, blank=True, null=True)
    identificacion = models.CharField(max_length=190, unique=True, blank=True, null=True)
    pais = models.CharField(max_length=30, blank=True, null=True)
    orcid = models.CharField(max_length=190, blank=True, null=True)
    url_orcid = models.CharField(max_length=190, blank=True, null=True)
    status = models.BooleanField(default=True)
    user = models.ForeignKey(CustomUser, related_name='user',
                             on_delete=models.SET_NULL, blank=True, null=True)

    def __str__(self) -> str:
        return self.nombres

    class Meta:
        unique_together = (('nombres', 'identificacion'))
        verbose_name = 'Persons'
        verbose_name_plural = 'Persons'

class UserRol(BaseModel):
    status = models.BooleanField(default=True)
    userId = models.ForeignKey(
        CustomUser, on_delete=models.CASCADE, related_name='users')
    rolesId = models.ForeignKey(
        Rol, on_delete=models.CASCADE, related_name='rols')

    def __str__(self):
        return f"{self.userId.username} - {self.rolesId.name}"

    class Meta:
        unique_together = (('userId', 'rolesId'))
        verbose_name = 'User_rols'
        verbose_name_plural = 'user_rols'

class Resource(BaseModel):
    path = models.CharField(max_length=190)
    id_padre = models.IntegerField()
    method = models.CharField(max_length=190)
    icono = models.CharField(max_length=190)
    link = models.CharField(max_length=190)
    titulo = models.CharField(max_length=100)
    roles = models.ManyToManyField(
        Rol, through='ResourceRol', related_name='resources_rol'
    )
    status = models.BooleanField(default=True)
    
    def __str__(self):
        return f"{self.titulo} - {self.roles.name}"
    
    class Meta:
        verbose_name = 'Resources'
        verbose_name_plural = 'Resources'

class ResourceRol(BaseModel):
    resource = models.ForeignKey(
        Resource, on_delete=models.CASCADE, related_name='resources')
    role = models.ForeignKey(
        Rol, on_delete=models.CASCADE, related_name='resources_rols')
    status = models.BooleanField(default=True)

    def __str__(self) -> str:
        return self.resource.path + ' - ' + self.role.name

    class Meta:
        verbose_name = 'Resources_rols'
        verbose_name_plural = 'resources_rols'

# class CustomLogEntry(LogEntry):
#     class Meta:
#         proxy = True
#         verbose_name = "Registro de Inicio de Sesión"
#         verbose_name_plural = "Registros de Inicio de Sesión"

class NivelFormacion(models.Model):
    nombre = models.CharField(max_length=190)
    status = models.BooleanField(default=True)
   
    def __str__(self):
        return self.nombre 
    
class Formacion(models.Model):
    nombre = models.CharField(max_length=190)
    fecha_grado = models.DateField(null=True, blank=True)
    cert_grado = models.FileField(upload_to='archivos/archivos_user_formacion/', null=True, blank=True)
    nombre_institucion = models.CharField(max_length=190)
    nivel_formacion = models.ForeignKey(NivelFormacion,on_delete=models.CASCADE)
    autor = models.ForeignKey(CustomUser,on_delete=models.CASCADE)
    status = models.BooleanField(default=True)
    
    def __str__(self):
        return self.nombre