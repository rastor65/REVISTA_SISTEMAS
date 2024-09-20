from rest_framework.views import APIView
from ...serializers.asignacion.asignacion_serializers import AsignacionSerializers
from ....models import Asignacion
from rest_framework.response import Response
from helps.create_response import create_response
from rest_framework import status

class AsignacionView(APIView):
   
    def get(self, request, *args, **kwargs):
        meta = None
        if 'meta' in request.headers:
            meta = request.headers["meta"]
        data = AsignacionSerializers(Asignacion.objects.all(),many=True,meta=meta)
        response ,code = create_response(status.HTTP_200_OK,"sucess",{"results":data.data})
        return Response(response,code)

class SaveAsignacionView(APIView):

    def post(self, request, *args, **kwargs):
        data = AsignacionSerializers(data=request.data)

        if data.is_valid():
            data.save(revistaId=request.data["revistaId"],pqrs=request.data["pqrs"],userCreate=request.user)
            response,code=create_response(status.HTTP_200_OK,"Success","Sucess")
            return Response(response,code)

        response, code = create_response(status.HTTP_400_BAD_REQUEST,"Bad Request",data.errors)
        return Response(response,code)

class DeleteAsignacionView(APIView):
    
    def get_object(self):
        try:
            pk = self.kwargs.get("pk")
            seccionId = Asignacion.objects.get(pk=pk)
            return seccionId
        except Asignacion.DoesNotExist:
            return None

    def delete(self,request,*args, **kwargs):
        instanceOrNone = self.get_object()
        if instanceOrNone is None:
            response, code = create_response(status.HTTP_400_BAD_REQUEST,"Bad Request","Asignacion {} not exist".format(self.kwargs.get('pk')))
            return Response(response,code)

        try:
            instanceOrNone.delete()
            response,code = create_response(status.HTTP_200_OK,"Success","Delete" )
            return Response(response,code)
        except BaseException as e:
            response,code = create_response(status.HTTP_400_BAD_REQUEST,"Bad Request",e.args )
            return Response(response,code)

class UpdateAsignacionView(APIView):

    def _allowed_methods(self):
        self.http_method_names.append("put")
        return [m.upper() for m in self.http_method_names if hasattr(self, m)]

    def get_object(self):
        try:
            pk = self.kwargs.get("pk")
            seccionId = Asignacion.objects.get(pk=pk)
            return seccionId
        except Asignacion.DoesNotExist:
            return None


    def put(self, request, *args, **kwargs):

        instanceOrNone = self.get_object()
        if instanceOrNone is None:
            response, code = create_response(status.HTTP_400_BAD_REQUEST,"Bad Request","Asignacion {} not exist".format(self.kwargs.get('pk')))
            return Response(response,code)

        instance = AsignacionSerializers(instanceOrNone,data=request.data)
        if instance.is_valid():

               try:
                    instance.save(revistaId=request.data["revistaId"],userUpdate=request.user)
                    response, code = create_response(status.HTTP_200_OK,"Success","Success")
                    return Response(response,code)
               except BaseException as e:
                   _response,_code = create_response(status.HTTP_400_BAD_REQUEST,"ss",e.args[0])
                   return Response(_response,_code)

        response,code = create_response(status.HTTP_400_BAD_REQUEST,"Bad Request", instance.errors)
        return Response(response,code)
