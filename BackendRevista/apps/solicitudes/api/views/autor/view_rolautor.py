from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status
from ...serializers.autor.autor_Serializers import RolAutorSerializer
from ....models import RolAutor 

class RolAutorList(generics.ListCreateAPIView):
    queryset = RolAutor.objects.filter(status=True)  
    serializer_class = RolAutorSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RolAutorDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = RolAutor.objects.filter(status=True) 
    serializer_class = RolAutorSerializer

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance is None:
            return Response(status=status.HTTP_404_NOT_FOUND)

        # Cambia el estado booleano en lugar de eliminar el objeto
        instance.status = False
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)