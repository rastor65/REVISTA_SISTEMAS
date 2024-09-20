from django.urls import path
from rest_framework.generics import ListAPIView, CreateAPIView, UpdateAPIView, DestroyAPIView, RetrieveAPIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAuthenticatedOrReadOnly
from helps.create_response import create_response
from helps.menuResources import menuResources
from .api.permission.IsAdmin import IsAdminRole