from rest_framework.views import APIView
from ...serializers.respuesta.respuesta_serializers import RespuestaSerializers,RespuestaPqrsSerializers
from ....models import Respuesta,Pqrs
from rest_framework.response import Response
from helps.create_response import create_response
from rest_framework import status
from ...serializers.pqrs.pqrs_serialziers import PqrsRespuestaSerializers

class RespuestaView(APIView):
   
    def get(self, request, *args, **kwargs):
        meta = None
        if 'meta' in request.headers:
            meta = request.headers["meta"]
        data = RespuestaSerializers(Respuesta.objects.all(),many=True,meta=meta)
        response ,code = create_response(status.HTTP_200_OK,"sucess",{"results":data.data})
        return Response(response,code)

class SaveRespuestaView(APIView):

    def post(self, request, *args, **kwargs):
        print(request.data)
        data = RespuestaSerializers(data=request.data)

        if data.is_valid():
            data.save(anexo=request.data["anexo"],pqrs=request.data["pqrs"], userCreate=request.user)
            response,code=create_response(status.HTTP_200_OK,"Success","Sucess")
            return Response(response,code)

        response, code = create_response(status.HTTP_400_BAD_REQUEST,"Bad Request",data.errors)
        return Response(response,code)

class DeleteRespuestaView(APIView):
    
    def get_object(self):
        try:
            pk = self.kwargs.get("pk")
            seccionId = Respuesta.objects.get(pk=pk)
            return seccionId
        except Respuesta.DoesNotExist:
            return None

    def delete(self,request,*args, **kwargs):
        instanceOrNone = self.get_object()
        if instanceOrNone is None:
            response, code = create_response(status.HTTP_400_BAD_REQUEST,"Bad Request","Respuesta {} not exist".format(self.kwargs.get('pk')))
            return Response(response,code)

        try:
            instanceOrNone.delete()
            response,code = create_response(status.HTTP_200_OK,"Success","Delete" )
            return Response(response,code)
        except BaseException as e:
            response,code = create_response(status.HTTP_400_BAD_REQUEST,"Bad Request",e.args )
            return Response(response,code)

class UpdateRespuestaView(APIView):

    def _allowed_methods(self):
        self.http_method_names.append("put")
        return [m.upper() for m in self.http_method_names if hasattr(self, m)]

    def get_object(self):
        try:
            pk = self.kwargs.get("pk")
            seccionId = Respuesta.objects.get(pk=pk)
            return seccionId
        except Respuesta.DoesNotExist:
            return None


    def put(self, request, *args, **kwargs):

        instanceOrNone = self.get_object()
        if instanceOrNone is None:
            response, code = create_response(status.HTTP_400_BAD_REQUEST,"Bad Request","Respuesta {} not exist".format(self.kwargs.get('pk')))
            return Response(response,code)

        instance = RespuestaSerializers(instanceOrNone,data=request.data)
        if instance.is_valid():
            instance.save(anexo=request.data["anexo"],userUpdate=request.user)
            response, code = create_response(status.HTTP_200_OK,"Success","Success")
            return Response(response,code)

        response,code = create_response(status.HTTP_400_BAD_REQUEST,"Bad Request", instance.errors)
        return Response(response,code)

class RespuestasQuery(APIView):
        
    def get_object(self):
        try:
            pk = self.kwargs.get("pk")
            pqrs = Pqrs.objects.filter(pk=pk)
            seccionId = Respuesta.objects.filter(pqrs=pqrs[0].pk)
            return seccionId,pqrs
        except (Pqrs.DoesNotExist ,Respuesta.DoesNotExist):
            return None
    
    def get(self, request, *args, **kwargs):
        
        respuesta,pqrs = self.get_object()
        if respuesta is None or pqrs is None:
            response, code = create_response(status.HTTP_400_BAD_REQUEST,"Bad Request","not exist".format(self.kwargs.get('pk')))
            return Response(response,code)
        
        data = RespuestaPqrsSerializers(respuesta,many=True)
        pqrsRespuesta = PqrsRespuestaSerializers(pqrs,many=True)
        resp = {
            "pqrs": pqrsRespuesta.data[0],
            "respuestas":data.data
        }
        response ,code = create_response(status.HTTP_200_OK,"sucess",{"results":resp})
        return Response(response,code)