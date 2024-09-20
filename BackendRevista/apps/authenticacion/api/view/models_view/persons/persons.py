from ....serializer.serializers import PersonsSerializers
from apps.authenticacion.models import Person
from .....mudules import status, Response, create_response
from django.core.exceptions import ValidationError
from django.http import Http404
from rest_framework import generics

class PersonList(generics.ListCreateAPIView):
    queryset = Person.objects.filter(status=True)
    serializer_class = PersonsSerializers

class PersonDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Person.objects.all()
    serializer_class = PersonsSerializers

    def perform_destroy(self, instance):
        # Cambia el estado booleano en lugar de eliminar el objeto
        instance.status = False
        instance.save()

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance is None:
            response, code = create_response(
                status.HTTP_404_NOT_FOUND, 'Error', 'Person not found')
            return Response(response, status=code)

        # Check if status is True before deleting
        if instance.status:
            self.perform_destroy(instance)
            response, code = create_response(
                status.HTTP_204_NO_CONTENT, 'Success', 'Person hidden successfully')
            return Response(response, status=code)
        else:
            response, code = create_response(
                status.HTTP_400_BAD_REQUEST, 'Error', 'Person is already hidden')
            return Response(response, status=code)