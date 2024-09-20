from .....mudules import (status, Response, create_response)
from apps.authenticacion.models import Gender
from ....serializer.serializers import GenderSerializers
from rest_framework import generics

class GenderList(generics.ListCreateAPIView):
    queryset = Gender.objects.filter(status=True)
    serializer_class = GenderSerializers

class GenderDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Gender.objects.all()
    serializer_class = GenderSerializers

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            response, code = create_response(
                status.HTTP_200_OK, 'Gender Update', serializer.data)
            return Response(response, status=code)
        response, code = create_response(
            status.HTTP_400_BAD_REQUEST, 'Error', serializer.errors)
        return Response(response, status=code)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance is None:
            response, code = create_response(
                status.HTTP_400_BAD_REQUEST, 'Error', 'Gender Not Found')
            return Response(response, status=code)

        # Cambia el estado booleano en lugar de eliminar el objeto
        instance.status = False
        instance.save()

        response, code = create_response(
            status.HTTP_200_OK, 'Status Updated', 'Status set to False')
        return Response(response, status=code)
