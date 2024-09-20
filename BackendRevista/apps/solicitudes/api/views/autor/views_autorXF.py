from django.http import Http404

from rest_framework import status
from rest_framework import generics
from rest_framework.response import Response

from ....models import UsuarioXFormacion
from ...serializers.autor.autor_Serializers import UsuarioXFormacionSerializer

from django.shortcuts import get_object_or_404, render
from django.http import FileResponse
from django.views import View
from django.http import HttpResponse

class UsuarioXFormacionList(generics.ListCreateAPIView):
    queryset = UsuarioXFormacion.objects.filter(status=True)
    serializer_class = UsuarioXFormacionSerializer
    
    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UsuarioXFormacionDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = UsuarioXFormacion.objects.filter(status=True)
    serializer_class = UsuarioXFormacionSerializer

    def perform_destroy(self, instance):
        # Cambia el estado booleano en lugar de eliminar el objeto
        instance.status = False
        instance.save()

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance is None:
            return Response({'detail': 'UsuarioXFormacion no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        # Verificar si el estado es True antes de cambiarlo o eliminarlo
        if instance.status:
            self.perform_destroy(instance)
            return Response({'detail': 'UsuarioXFormacion ocultado exitosamente'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'detail': 'El UsuarioXFormacion ya está oculto'}, status=status.HTTP_400_BAD_REQUEST)  

def descargar_archivo(request, archivo):
    if archivo:
        response = FileResponse(archivo)
        return response
    else:
        return HttpResponse("Archivo no encontrado", status=404)

def descargar_cert_grado(request, pk):
    contenido = get_object_or_404(UsuarioXFormacion, pk=pk, status=True)
    return descargar_archivo(request, contenido.cert_grado)


