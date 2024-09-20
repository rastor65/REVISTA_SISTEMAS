from django.http import Http404

from rest_framework import status
from rest_framework.response import Response
from rest_framework import generics
from django.shortcuts import get_object_or_404
from django.http import FileResponse
from rest_framework.mixins import UpdateModelMixin
import os

from ....models import *
from ...serializers.literatura.literatura_serilizers import ContenidoSolicitudSerializer

class ContenidoSolicitudList(generics.ListCreateAPIView):
    queryset = ContenidoSolicitud.objects.filter(status=True)
    serializer_class = ContenidoSolicitudSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            archivo_adjunto = request.FILES.get('archivo_adjunto')
            declaracion_originalidad = request.FILES.get('declaracion_originalidad')

            if archivo_adjunto and not self._is_pdf(archivo_adjunto):
                return Response({'error': 'El archivo adjunto debe ser un PDF.'}, status=status.HTTP_400_BAD_REQUEST)
            
            if declaracion_originalidad and not self._is_pdf(declaracion_originalidad):
                return Response({'error': 'La declaración de originalidad debe ser un PDF.'}, status=status.HTTP_400_BAD_REQUEST)

            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def _is_pdf(self, file):
        return file.name.lower().endswith('.pdf')

class ContenidoSolicitudDetail(generics.RetrieveUpdateDestroyAPIView, UpdateModelMixin):
    queryset = ContenidoSolicitud.objects.filter(status=True)
    serializer_class = ContenidoSolicitudSerializer

    def perform_destroy(self, instance):
        instance.status = False
        instance.save()

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)
    
    def patch(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', True)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

def descargar_archivo(request, pk):
    contenido = get_object_or_404(ContenidoSolicitud, pk=pk, status=True)
    archivo = contenido.archivo_adjunto
    response = FileResponse(archivo)
    return response

def descargar_originalidad(request, pk):
    contenido = get_object_or_404(ContenidoSolicitud, pk=pk, status=True)
    archivo = contenido.declaracion_originalidad
    response = FileResponse(archivo)
    return response
