from django.http import Http404

from rest_framework import status
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response

from ....models import PasosSeguimiento
from ...serializers.solicitud.solicitud_serializers import PasosSeguimientoSerializer

class PasosSeguimientoList(generics.ListCreateAPIView):
    queryset = PasosSeguimiento.objects.all()
    serializer_class = PasosSeguimientoSerializer

    def list(self, request, *args, **kwargs):
        queryset = PasosSeguimiento.objects.filter(status=True)  # Filtrar por status=True
        serializer = self.get_serializer(queryset, many=True)
        data = {'pasos_seguimiento': serializer.data}
        return Response(data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class PasosSeguimientoDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = PasosSeguimiento.objects.all()
    serializer_class = PasosSeguimientoSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = {'paso_seguimiento': serializer.data}
        return Response(data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, *args, **kwargs):
        instance = self.get_object()
        instance.status = False  # Establecer el estado en "oculto"
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)