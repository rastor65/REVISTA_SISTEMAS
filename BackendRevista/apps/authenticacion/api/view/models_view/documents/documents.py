from .....mudules import (Response, status, create_response)
from apps.authenticacion.models import DocumentType
from ....serializer.serializers import DocumentSerializers
from rest_framework import generics

class DocumentList(generics.ListCreateAPIView):
    queryset = DocumentType.objects.filter(status=True)
    serializer_class = DocumentSerializers

class DocumentDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = DocumentType.objects.all()
    serializer_class = DocumentSerializers

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data)
        if serializer.is_valid():
            serializer.save()
            response, code = create_response(
                status.HTTP_200_OK, 'Document Update', serializer.data)
            return Response(response, status=code)
        response, code = create_response(
            status.HTTP_400_BAD_REQUEST, 'Error', serializer.errors)
        return Response(response, status=code)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance is None:
            response, code = create_response(
                status.HTTP_400_BAD_REQUEST, 'Error', 'Type document Not Exist')
            return Response(response, status=code)

        # Cambia el estado booleano en lugar de eliminar el objeto
        instance.status = False
        instance.save()

        response, code = create_response(
            status.HTTP_200_OK, 'Status Updated', 'Status set to False')
        return Response(response, status=code)
