from django.contrib.auth import get_user_model
from django.contrib.auth.hashers import make_password

from rest_framework import  serializers
from rest_framework.validators import UniqueValidator
from rest_framework.serializers import CharField, ModelSerializer, SlugField

from ...models import CustomUser
from .serializers import RolesSerializers
from .customValidators import UserValidatorBefore
User = get_user_model()
    
class CustomUserSerializer(serializers.ModelSerializer):
    avatar_url = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = ('id', 'username', 'email', 'avatar_url')
        
    def get_avatar_url(self, user):
        if user.avatar:
            return self.context['request'].build_absolute_uri(user.avatar.url)
        return None
    
# class CustomLogEntrySerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CustomLogEntry
#         fields = '__all__'

class UserChangePassword(ModelSerializer):
    password = CharField()

    class Meta:
        model = CustomUser
        fields = ('password', 'id')
        validators = [UserValidatorBefore()]

class CreateUserSerializers(ModelSerializer):

    username = SlugField(
        max_length=100,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    class Meta:
        model = CustomUser
        fields = ('username', 'password', 'email', 'avatar')
        validators = [UserValidatorBefore()]

class UserSerializersSimpleRegister(ModelSerializer):
    username = SlugField(
        max_length=100,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )

    class Meta:
        model = CustomUser
        fields = ('username', 'password', 'email', 'first_name', 'last_name')
        validators = [UserValidatorBefore()]

class PasswordChangeSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True)

class UserSerializer(serializers.ModelSerializer):
    roles = RolesSerializers(many=True, read_only=True)
    email = serializers.EmailField(
        required=True)
    username = serializers.CharField(
        required=True)
    password = serializers.CharField(
        min_length=8)
    avatar = serializers.ImageField(
        required=False, allow_null=True) 

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        try:
            if (len(representation['roles'])):
                representation['roles'][0] = representation['roles'][0]['id']
            return representation
        except Exception as e:
            return representation
        
    class Meta:
        model = get_user_model()
        fields = ('email', 'username', 'roles', 'password', 'avatar') 
        
def validate_password(self, value):
    return make_password(value)

def validate_username(self, value):
    value = value.replace(" ", "") 
    try:
        user = get_user_model().objects.get(username=value)
        # Si es el mismo usuario mandando su mismo username le dejamos
        if user == self.instance:
            return value
    except get_user_model().DoesNotExist:
        return value
    raise serializers.ValidationError("Nombre de usuario en uso") 

def validate_email(self, value):
    # Hay un usuario con este email ya registrado?
    try:
        user = get_user_model().objects.get(email=value)
    except get_user_model().DoesNotExist:
        return value
    # En cualquier otro caso la validación fallará
    raise serializers.ValidationError("Email en uso")