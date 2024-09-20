from rest_framework.views import APIView
from ...serializers.pqrs.pqrs_serialziers import PqrsSerializers
from ...serializers.pqrs.tipo_serializers import PqrsTipoSerializers
from ....models import Pqrs
from rest_framework.response import Response
from helps.create_response import create_response
from rest_framework import status

class PqrsView(APIView):
   
    def get(self, request, *args, **kwargs):
        meta = None
        if 'meta' in request.headers:
            meta = request.headers["meta"]
        data = PqrsSerializers(Pqrs.objects.all(),many=True,meta=meta)
        response ,code = create_response(status.HTTP_200_OK,"sucess",{"results":data.data})
        return Response(response,code)

class SavePqrsView(APIView):

    def post(self, request, *args, **kwargs):
        data = PqrsSerializers(data=request.data)
        if data.is_valid():
            data.save(persona=request.data["persona"],tipo=request.data["tipopqrs"],userCreate=request.user)
            response,code=create_response(status.HTTP_200_OK,"Success","Sucess")
            return Response(response,code)

        response, code = create_response(status.HTTP_400_BAD_REQUEST,"Bad Request",data.errors)
        return Response(response,code)
    
class DeletePqrsView(APIView):
    
    def get_object(self):
        try:
            pk = self.kwargs.get("pk")
            seccionId = Pqrs.objects.get(pk=pk)
            return seccionId
        except Pqrs.DoesNotExist:
            return None

    def delete(self,request,*args, **kwargs):
        instanceOrNone = self.get_object()
        if instanceOrNone is None:
            response, code = create_response(status.HTTP_400_BAD_REQUEST,"Bad Request","Pqrs {} not exist".format(self.kwargs.get('pk')))
            return Response(response,code)

        try:
            instanceOrNone.delete()
            response,code = create_response(status.HTTP_200_OK,"Success","Delete" )
            return Response(response,code)
        except BaseException as e:
            response,code = create_response(status.HTTP_400_BAD_REQUEST,"Bad Request",e.args )
            return Response(response,code)

class UpdatePqrsView(APIView):

    def _allowed_methods(self):
        self.http_method_names.append("put")
        return [m.upper() for m in self.http_method_names if hasattr(self, m)]

    def get_object(self):
        try:
            pk = self.kwargs.get("pk")
            seccionId = Pqrs.objects.get(pk=pk)
            return seccionId
        except Pqrs.DoesNotExist:
            return None

    def put(self, request, *args, **kwargs):

        instanceOrNone = self.get_object()
        if instanceOrNone is None:
            response, code = create_response(status.HTTP_400_BAD_REQUEST,"Bad Request","Pqrs {} not exist".format(self.kwargs.get('pk')))
            return Response(response,code)

        instance = PqrsSerializers(instanceOrNone,data=request.data)
        if instance.is_valid():
            instance.save(userUpdate=request.user)
            response, code = create_response(status.HTTP_200_OK,"Success","Success")
            return Response(response,code)

        response,code = create_response(status.HTTP_400_BAD_REQUEST,"Bad Request", instance.errors)
        return Response(response,code)
