from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth import authenticate
from rest_framework.validators import UniqueValidator
from .customValidators import UserValidatorBefore
from apps.authenticacion.models import CustomUser
from .serializers import RolesSimpleSerializers, PersonsSimpleSerializers
User = get_user_model()

class RegistroSerializzer(serializers.Serializer):
    username = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField()
    last_name = serializers.CharField()

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        return user

class RegisterUserSerializer(serializers.ModelSerializer):
    username = serializers.SlugField(
        max_length=100,
        validators=[UniqueValidator(queryset=CustomUser.objects.all())]
    )
    email = serializers.EmailField()
    password = serializers.CharField()
    name = serializers.CharField(required=True)
    lastname = serializers.CharField(required=True)
    avatar = serializers.ImageField(required=False)
    resetToken = serializers.CharField(max_length=256, required=False)

    class Meta:
        model = CustomUser
        fields = '__all__'
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user

    
class LoginSerializers(serializers.ModelSerializer):
    username = serializers.CharField(label='Email/username')
    password = serializers.CharField(
        min_length=8, error_messages={
            'min_length': 'La contraseña debe tener al menos 8 caracteres.'})
    roles = RolesSimpleSerializers(many=True, required=False)

    class Meta:
        model = CustomUser
        fields = ('id', 'password', 'username', 'roles')

    def validate(self, attrs):
        user = authenticate(**attrs)
        if user and user.is_active:
            return user
        raise serializers.ValidationError(
            {'detail': 'Las credenciales ingresadas son incorrectas.'})


class RegisterSerializers(serializers.ModelSerializer):

    username = serializers.SlugField(
        max_length=100,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    email = serializers.EmailField()
    password = serializers.CharField()

    class Meta:
        model = CustomUser
        fields = '__all__'
        validators = [UserValidatorBefore()]

    person = PersonsSimpleSerializers(read_only=True)

    def create(self, validated_data):
        user = CustomUser.objects.create(**validated_data)
        return user