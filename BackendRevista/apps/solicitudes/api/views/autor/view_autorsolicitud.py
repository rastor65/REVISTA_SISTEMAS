from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from ....models import AutorXSolicitud
from ...serializers.autor.autor_Serializers import AutorXSolicitudSerializer

class AutorXSolicitudList(generics.ListCreateAPIView):
    queryset = AutorXSolicitud.objects.filter(status=True)  # Filtrar por status=True
    serializer_class = AutorXSolicitudSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class AutorXSolicitudDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = AutorXSolicitud.objects.filter(status=True)  # Filtrar por status=True
    serializer_class = AutorXSolicitudSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # Cambia el estado booleano en lugar de eliminar el objeto
        instance.status = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)