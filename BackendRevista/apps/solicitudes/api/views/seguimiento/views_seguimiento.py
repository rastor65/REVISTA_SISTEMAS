from django.http import Http404
from datetime import datetime, timedelta
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework import status
from rest_framework import generics
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.http import FileResponse
from ....models import Seguimiento, EstadoSeguimiento, PasosSeguimiento, Solicitud
from ...serializers.seguimiento.seguimiento_serializers import SeguimientoSerializer
from django.core.mail import send_mail
from django.shortcuts import render, redirect
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist
from apps.authenticacion.models import CustomUser, UserRol, Rol
from django.http import HttpResponse

class SeguimientoList(generics.ListCreateAPIView):
    queryset = Seguimiento.objects.filter(status=True)  
    serializer_class = SeguimientoSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SeguimientoDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Seguimiento.objects.filter(status=True)
    serializer_class = SeguimientoSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.status:
            serializer = self.get_serializer(instance)
            data = {'seguimiento': serializer.data}
            return Response(data)
        else:
            return Response('No encontrado... Realice otra búsqueda.', status=status.HTTP_404_NOT_FOUND)

    def perform_update(self, serializer):
        instance = self.get_object()

        if (
            self.request.data.get('fecha_asignacion') or
            self.request.data.get('fecha_evaluacion') or
            self.request.data.get('estado_seguimiento')
        ):
            # Si se están actualizando campos relevantes, establece cambio_relevante en True
            instance.cambio_relevante = True

        serializer.save()  # Guarda la instancia actualizada

    def perform_destroy(self, instance):
        instance.status = False
        instance.save()

def descargar_archivo(request, archivo):
    if archivo:
        response = FileResponse(archivo)
        return response
    else:
        return HttpResponse("Archivo no encontrado", status=404)
    
def descargar_formato_evaluacion(request, pk):
    contenido = get_object_or_404(Seguimiento, pk=pk, status=True)
    return descargar_archivo(request, contenido.formato_evaluacion)

def descargar_correciones(request, pk):
    contenido = get_object_or_404(Seguimiento, pk=pk, status=True)
    return descargar_archivo(request, contenido.correciones)

# @receiver(post_save, sender=Seguimiento)
# def enviar_correo_cuando_actualiza(sender, instance, **kwargs):
#     if instance.estado_seguimiento and instance.pasos_seguimiento.nivel != 1:
#         solicitud_id = instance.solicitudId_id
#         print( "id de la soliciud: ", solicitud_id)
#         solicitud_object = Solicitud.objects.get(pk=solicitud_id)
#         print("solicitud del seguimiento: ", solicitud_object)
        
#         autores_data = CustomUser.objects.values('id', 'email')
#         # print(instance.solicitudId)
#         # buscar solicitud por id y tomar autores
#         print(sender)
#         subject = 'Actualización del seguimiento de su solicitud'

#         message = f'''
#         Estimado/a {instance.responsableId.username},

#         Le informamos que ha habido una actualización en el estado del seguimiento de su solicitud en nuestra plataforma.

#         Estado actual del seguimiento: {instance.estado_seguimiento.nombre}

#         Le invitamos a iniciar sesión en nuestra plataforma para revisar los detalles y tomar las acciones necesarias.

#         Gracias por utilizar nuestros servicios.

#         Atentamente,
#         El equipo de Revistas Uniguajira.
#         Este es un correo electrónico automático. Por favor, no responda.
#         '''

#         from_email = 'mendozaym01@gmail.com'

#         recipient_list = [autor['email'] for autor in autores_data] + [instance.responsableId.email]
#         send_mail(subject, message, from_email, recipient_list)
  
# @receiver(post_save, sender=Seguimiento)      
# def enviar_correo_10_dias(sender, instance, **kwargs):
#     # Calcula la fecha actual
#     fecha_actual = datetime.now().date()
#     # Calcula la fecha de programación para 10 días en el futuro
#     fecha_programacion = fecha_actual + timedelta(days=10)
#     # Busca los seguimientos programados para la fecha de programación
#     seguimientos = Seguimiento.objects.filter(
#         fecha_programacion=fecha_programacion
#     )

#     if seguimientos:
#         # Envía correos electrónicos a los responsables de los seguimientos
#         for seguimiento in seguimientos:
#             subject = f'Recordatorio: Evaluación en {10} días'
            
#             message = f'''
# Cordial saludo:
                
# Estimado/a {seguimiento.responsableId.username},

# Este es un recordatorio de que la fecha de evaluación para el seguimiento de la solicitud "{seguimiento.solicitudId.titulo_articulo}" está programada para el {fecha_programacion}.

# Por favor, asegúrese de estar preparado para la evaluación en esa fecha.
                
# Le invitamos a ingresar a nuestra plataforma para realizar las revisiones pertinentes.

# Gracias por su atención.

# Atentamente,
# El equipo de Revistas Uniguajira.

# Este es un correo electrónico automático. Por favor, no responda.
#             '''

#             from_email = 'mendozaym01@gmail.com'
#             recipient_list = [seguimiento.responsableId.email]

#             send_mail(subject, message, from_email, recipient_list)

# @receiver(post_save, sender=Seguimiento)  
# def enviar_correo_5_dias(sender, instance, **kwargs):
#     # Calcula la fecha actual
#     fecha_actual = datetime.now().date()
#     # Calcula la fecha de programación para 5 días en el futuro
#     fecha_programacion = fecha_actual + timedelta(days=5)
#     # Busca los seguimientos programados para la fecha de programación
#     seguimientos = Seguimiento.objects.filter(
#         fecha_programacion=fecha_programacion
#     )
#     if seguimientos:
#         # Envía correos electrónicos a los responsables de los seguimientos
#         for seguimiento in seguimientos:
#             subject = f'Recordatorio: Evaluación en {5} días'
            
#             message = f'''
# Cordial saludo:
                
# Estimado/a {seguimiento.responsableId.username},

# Este es un recordatorio de que la fecha de evaluación para el seguimiento de la solicitud "{seguimiento.solicitudId.titulo_articulo}" está programada para el {fecha_programacion}.

# Por favor, asegúrese de estar preparado para la evaluación en esa fecha.
                
# Le invitamos a ingresar a nuestra plataforma para realizar las revisiones pertinentes.

# Gracias por su atención.

# Atentamente,
# El equipo de Revistas Uniguajira.

# Este es un correo electrónico automático. Por favor, no responda.
#             '''

#             from_email = 'mendozaym01@gmail.com'
#             recipient_list = [seguimiento.responsableId.email]

#             send_mail(subject, message, from_email, recipient_list)

                   
# @receiver(post_save, sender=Seguimiento)
# def enviar_correo_al_responsable(sender, instance, created, **kwargs):
#     if instance.responsableId:
#         # Verifica si se ha creado un nuevo seguimiento, si tiene un responsable asignado y si ese responsable tiene un correo válido
#         from_email = 'mendozaym01@gmail.com'
#         subject = 'Asignación de artículo'

#         message = f'''
#         Estimado/a {instance.responsableId.username},

#         Le informamos que se le ha asignado un nuevo artículo en nuestra plataforma:

#         Título del artículo: "{instance.solicitudId.titulo_articulo}"
#         Fecha de programación: {instance.fecha_programacion}

#         Le invitamos a iniciar sesión en nuestra plataforma para revisar los detalles y tomar las acciones necesarias.

#         Gracias por su colaboración.

#         Atentamente,
#         El equipo de Revistas Uniguajira.

#         Este es un correo electrónico automático. Por favor, no responda.
#         '''

#         recipient_list = [instance.responsableId.email]

#         send_mail(subject, message, from_email, recipient_list)
        
# @receiver(post_save, sender=Seguimiento)
# def enviar_correo_evaluacion(sender, instance, raw, **kwargs):

#     if instance.pasos_seguimiento.nombre in ["Revisión de evaluador 1", "Revisión de evaluador 2"]:
#         if instance.estado_seguimiento != "Pendiente":
#             if instance.responsableId:
#                 from_email = 'mendozaym01@gmail.com'
                
#                 subject = 'Evaluación Realizada'
#                 message = f'''
#                 Estimado/a {instance.responsableId.username},

#                 Le informamos que se ha realizado una evaluación para el artículo "{instance.solicitudId.titulo_articulo}".
#                 Fecha de evaluación: {instance.fecha_evaluacion}.

#                 Le invitamos a iniciar sesión en nuestra plataforma para revisar los detalles y tomar las acciones necesarias.

#                 Gracias por su colaboración.

#                 Atentamente,
#                 El equipo de Revistas Uniguajira.

#                 Este es un correo electrónico automático. Por favor, no responda.
#                 '''
#                 recipient_list = [instance.responsableId.email]
                
#                 send_mail(subject, message, from_email, recipient_list)


# @receiver(post_save, sender=Seguimiento)
# def notificar_editor_jefe(sender, instance, created, **kwargs):

#     if instance.pasos_seguimiento.nombre in ["Revisión de evaluador 1", "Revisión de evaluador 2"]:
#         if instance.estado_seguimiento.nombre in ["Aceptado sin cambios", "Aceptado con cambios menores"]:
#             editor_jefe = Rol.objects.get(name='Editor Jefe')      
#             usuarios_editor_jefe = editor_jefe.users.filter(is_active=True)
#             from_email = 'mendozaym01@gmail.com'      
#             subject = 'Notificación: Artículo Aceptado'
#             message = f'''  
#             Estimado Editor Jefe,

#             Le informamos que el seguimiento del artículo "{instance.solicitudId.titulo_articulo}" ha sido aceptado por los evaluadores.

#             Le invitamos a iniciar sesión en nuestra plataforma para realizar las revisiones pertinentes.

#             Gracias por su atención.

#             Atentamente,
#             El equipo de Revistas Uniguajira.

#             Este es un correo electrónico automático. Por favor, no responda.
#             '''
#             recipient_list = usuarios_editor_jefe
#             send_mail(subject, message, from_email, recipient_list)
