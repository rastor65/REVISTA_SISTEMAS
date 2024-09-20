from django.http import Http404

from rest_framework import status
from rest_framework import generics
from rest_framework.response import Response

from apps.authenticacion.models import NivelFormacion
from apps.authenticacion.api.serializer.autor_Serializers import NivelFormacionSerializer

class NivelFormacionList(generics.ListCreateAPIView):
    serializer_class = NivelFormacionSerializer

    def get_queryset(self):
        return NivelFormacion.objects.filter(status=True)  # Filtrar por status=True

    def perform_create(self, serializer):
        serializer.save()

class NivelFormacionDetail(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = NivelFormacionSerializer

    def get_queryset(self):
        return NivelFormacion.objects.filter(status=True)  # Filtrar por status=True

    def perform_destroy(self, instance):
        # Cambiar el estado booleano en lugar de eliminar el objeto
        instance.status = False
        instance.save()

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance is None:
            return Response({'detail': 'Nivel de formación no encontrado'}, status=status.HTTP_404_NOT_FOUND)

        # Verificar si el estado es True antes de cambiarlo o eliminarlo
        if instance.status:
            self.perform_destroy(instance)
            return Response({'detail': 'Nivel de formación ocultado exitosamente'}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({'detail': 'El nivel de formación ya está oculto'}, status=status.HTTP_400_BAD_REQUEST)