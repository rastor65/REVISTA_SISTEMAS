from django.http import Http404
from rest_framework import status
from rest_framework import generics
from ....models import Solicitud
from ...serializers.solicitud.solicitud_serializers import SolicitudSerializer
from django.core.mail import send_mail
from django.shortcuts import render, redirect
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.response import Response
from apps.authenticacion.models import CustomUser
from django.db.models import F
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from rest_framework.decorators import action

class SolicitudList(generics.ListCreateAPIView):
    queryset = Solicitud.objects.filter(status=True)
    serializer_class = SolicitudSerializer

    def create(self, request, *args, **kwargs):
        solicitud_data = request.data.copy()
        autores_data = solicitud_data.get('autores', [])
        serializer = self.get_serializer(data=solicitud_data)
        if serializer.is_valid():
            solicitud = serializer.save()
            for autor_id in autores_data:
                autor = CustomUser.objects.get(pk=autor_id)
                solicitud.autores.add(autor)

            enviar_correo_cuando_se_crea_solicitud(sender=Solicitud, instance=solicitud, created=True, autores=autores_data)

            headers = self.get_success_headers(serializer.data)
            return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class SolicitudDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = Solicitud.objects.all()
    serializer_class = SolicitudSerializer

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.status:
            serializer = self.get_serializer(instance)
            data = {'solicitud': serializer.data}
            return Response(data)
        else:
            return Response('No encontrado', status=status.HTTP_404_NOT_FOUND)
    def perform_destroy(self, instance):
        instance.status = False
        instance.save()

    @action(detail=True, methods=['patch'])
    def visto_bueno(self, request, pk=None):
        solicitud = self.get_object()
        flag = bool(request.data.get('visto_bueno', True))
        solicitud.visto_bueno = flag
        if flag:
            solicitud.visto_bueno_por = request.user
            solicitud.visto_bueno_fecha = timezone.now()
        else:
            solicitud.visto_bueno_por = None
            solicitud.visto_bueno_fecha = None
        solicitud.save(update_fields=['visto_bueno', 'visto_bueno_por', 'visto_bueno_fecha'])
        return Response(self.get_serializer(solicitud).data)

@receiver(post_save, sender=Solicitud)
def enviar_correo_cuando_se_crea_solicitud(sender, instance, created, **kwargs):
    if created:
        print("Se ha creado una nueva solicitud.")
        autores_ids = kwargs.get('autores', [])  # Obtener IDs de autores
        autores_objects = CustomUser.objects.filter(pk__in=autores_ids)  # Obtener objetos CustomUser
        print("Autores relacionados:", autores_objects)

        if autores_objects:
            print("Se encontraron autores relacionados.")

            subject = 'Nueva solicitud de sometimiento de artículo'
            from_email = 'soportecei@uniguajira.edu.co'
            recipient_list = [autor.email for autor in autores_objects]

            # Datos para la plantilla
            context = {
                'titulo_articulo': instance.titulo_articulo,
                'fecha_creacion': instance.fecha_creacion,
                'autores': '; '.join([f"{autor.username}: {autor.email}, " for autor in autores_objects]),
            }

            # Renderizar la plantilla HTML
            html_content = render_to_string('solicitudes/sometimiento.html', context)
            text_content = strip_tags(html_content)

            # Crear el correo electrónico
            msg = EmailMultiAlternatives(subject, text_content, from_email, recipient_list)
            msg.attach_alternative(html_content, "text/html")
            
            try:
                msg.send()
                print("Correo electrónico enviado correctamente.")
            except Exception as e:
                print(f"Error al enviar el correo electrónico: {str(e)}")
        else:
            print("No se encontraron autores relacionados.")

# @receiver(post_save, sender=Solicitud)
# def enviar_correo_cuando_se_crea_solicitud(sender, instance, created, **kwargs):
#     if created:
#         print("Se ha creado una nueva solicitud.")
#         autores_ids = kwargs.get('autores', [])  # Obtener IDs de autores
#         autores_objects = CustomUser.objects.filter(pk__in=autores_ids)  # Obtener objetos CustomUser
#         print("Autores relacionados:", autores_objects)
        
#         if autores_objects:
#             print("Se encontraron autores relacionados.")

#             subject = 'Nueva solicitud de sometimiento de artículo'

#             message = f'''
# Cordial saludo:
# ¡Estimados Autores!

# Hemos recibido una nueva Solicitud de Revisión de Artículo. Con los siguientes detalles:

# Título del Artículo: {instance.titulo_articulo}
# Fecha de Creación: {instance.fecha_creacion}
# Autores: {'; '.join([f"{autor.username} {autor.email}" for autor in autores_objects])}

# Gracias por su contribución y participación en nuestro proceso de revisión de artículos.

# Lo invitamos a ingresar a nuestra plataforma para realizar las revisiones pertinentes.

# Este es un correo enviado automáticamente; favor no responder.
# '''

#             from_email = 'soportecei@uniguajira.edu.co'

#             recipient_list = [autor.email for autor in autores_objects]

#             try:
#                 send_mail(subject, message, from_email, recipient_list)
#                 print("Correo electrónico enviado correctamente.")
#             except Exception as e:
#                 print(f"Error al enviar el correo electrónico: {str(e)}")
#         else:
#             print("No se encontraron autores relacionados.")