from rest_framework.views import APIView
from ...serializers.anexo.anexo_serializers import AnexoSerializers
from ....models import Anexo
from rest_framework.response import Response
from helps.create_response import create_response
from rest_framework import status

class AnexoView(APIView):
   
    def get(self, request, *args, **kwargs):
        meta = None
        if 'meta' in request.headers:
            meta = request.headers["meta"]
        data = AnexoSerializers(Anexo.objects.all(),many=True,meta=meta)
        response ,code = create_response(status.HTTP_200_OK,"sucess",{"results":data.data})
        return Response(response,code)

class SaveAnexoView(APIView):

    def post(self, request, *args, **kwargs):
        data = AnexoSerializers(data=request.data)

        if data.is_valid():
            data.save(userCreate=request.user)
            response,code=create_response(status.HTTP_200_OK,"Success","Sucess")
            return Response(response,code)

        response, code = create_response(status.HTTP_400_BAD_REQUEST,"Bad Request",data.errors)
        return Response(response,code)

class DeleteAnexoView(APIView):
    
    def get_object(self):
        try:
            pk = self.kwargs.get("pk")
            seccionId = Anexo.objects.get(pk=pk)
            return seccionId
        except Anexo.DoesNotExist:
            return None

    def delete(self,request,*args, **kwargs):
        instanceOrNone = self.get_object()
        if instanceOrNone is None:
            response, code = create_response(status.HTTP_400_BAD_REQUEST,"Bad Request","Anexo {} not exist".format(self.kwargs.get('pk')))
            return Response(response,code)

        try:
            instanceOrNone.delete()
            response,code = create_response(status.HTTP_200_OK,"Success","Delete" )
            return Response(response,code)
        except BaseException as e:
            response,code = create_response(status.HTTP_400_BAD_REQUEST,"Bad Request",e.args )
            return Response(response,code)

class UpdateAnexoView(APIView):

    def _allowed_methods(self):
        self.http_method_names.append("put")
        return [m.upper() for m in self.http_method_names if hasattr(self, m)]

    def get_object(self):
        try:
            pk = self.kwargs.get("pk")
            seccionId = Anexo.objects.get(pk=pk)
            return seccionId
        except Anexo.DoesNotExist:
            return None

    def put(self, request, *args, **kwargs):

        instanceOrNone = self.get_object()
        if instanceOrNone is None:
            response, code = create_response(status.HTTP_400_BAD_REQUEST,"Bad Request","Anexo {} not exist".format(self.kwargs.get('pk')))
            return Response(response,code)

        instance = AnexoSerializers(instanceOrNone,data=request.data)
        if instance.is_valid():
            instance.save(userUpdate=request.user)
            response, code = create_response(status.HTTP_200_OK,"Success","Success")
            return Response(response,code)

        response,code = create_response(status.HTTP_400_BAD_REQUEST,"Bad Request", instance.errors)
        return Response(response,code)
