from django.contrib.auth import get_user_model

from rest_framework import serializers
from rest_framework.utils.representation import smart_repr

from ...mudules import create_response 
User = get_user_model()

class UserValidatorBefore:

    def __init__(self, username='username', email='email', password='password'):
        self.username = username
        self.email = email
        self.password = password

    def __call__(self, attrs):
        message = {}

        if 'password' in attrs and len(attrs[self.password]) < 8 and attrs[self.password].isalnum():
            message[self.password] = 'The password must be alphanumeric and more than 8 digits'
        if 'email' in attrs and User.objects.filter(email=attrs[self.email]).exists():
            message[self.email] = 'Email already exist'

        if message:
            raise serializers.ValidationError(message, code='before')

        return attrs

    def __repr__(self):
        return '<%s(email=%s, password=%s, username=%s)>' % (
            self.__class__.__name__,
            smart_repr(self.email),
            smart_repr(self.password),
            smart_repr(self.username)
        )

class ChangeValidator:
    def __init__(self, password='password'):
        self.password = password

    def __call__(self, attrs):
        message = {}

        if len(attrs[self.password]) < 8 and attrs[self.password].isalnum():
            message[self.password] = 'The password must be alphanumeric and more than 8 digits'

        if message:
            raise serializers.ValidationError(message, code='before')

        return attrs

    def __repr__(self):
        return '<%s(password=%s)>' % (
            self.__class__.__name__,
            smart_repr(self.password),
        )
