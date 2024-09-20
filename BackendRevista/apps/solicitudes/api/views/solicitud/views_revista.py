from django.http import Http404
from rest_framework import status
from rest_framework import generics
from rest_framework.response import Response
from ....models import Revista
from ...serializers.solicitud.solicitud_serializers import RevistaSerializer

class RevistaList(generics.ListCreateAPIView):
    queryset = Revista.objects.all()
    serializer_class = RevistaSerializer

    def list(self, request, *args, **kwargs):
        queryset = Revista.objects.filter(status=True) 
        serializer = self.get_serializer(queryset, many=True)
        data = {'revista': serializer.data}
        return Response(data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class RevistaDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Revista.objects.all()
    serializer_class = RevistaSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance)
        data = {'revista': serializer.data}
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
        instance.status = False  
        instance.save()
        return Response(status=status.HTTP_204_NO_CONTENT)