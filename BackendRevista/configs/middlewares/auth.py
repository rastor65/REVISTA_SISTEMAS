import os
import json
import logging
import environ

from pathlib import Path

from django.http import HttpResponse
from django.utils.deprecation import MiddlewareMixin
from django.contrib.auth import get_user_model

from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed, TokenBackendError, TokenError, exceptions

from helps.create_response import create_response

from apps.authenticacion.models import CustomUser

env = environ.Env(
    DEBUG=(bool, False)
)

BASE_DIR = Path(__file__).resolve().parent.parent

environ.Env.read_env(os.path.join(BASE_DIR, '.env'))
User = get_user_model()

# Initialize logger
logger = logging.getLogger(__name__)
# Get JWT secret key

SECRET_KEY = env("SECRET_OR_KEY")


class CustomMiddleware(MiddlewareMixin):

    """
    Custom Middleware Class to process a request before it reached the endpoint
    """

    def process_request(self, request):
        """
        Custom middleware handler to check authentication for a user with JWT authentication
        :param request: Request header containing authorization tokens
        :type request: Django Request Object
        :return: HTTP Response if authorization fails, else None
        """
        routes_free = ['/auth/login/', '/auth/register/',
                       '/redoc/', '/admin/']
        if routes_free.__contains__(request.path):
            return None

        jwt_token: str = request.headers.get('authorization', None)
        logger.info(f"request received for endpoint {str(request.path)}")

        # If token Exists
        if jwt_token:
            try:
                auth = JWTAuthentication()
                tokenUser, token = auth.authenticate(request)

                
                if request.user.is_authenticated:

                    user = None

                if ('user' in request.session):
                    user = CustomUser.objects.get(id=request.session['user'])
                else:
                    user = CustomUser.objects.get(id=token['user_id'])

                if not tokenUser.is_authenticated:
                    response, code = create_response(
                        401, 'Unauthorized', {
                            "message": 'User not in session'
                        }
                    )
                    return HttpResponse(json.dumps(response), status=code)

                if 'sessionid' in request.COOKIES and len(request.COOKIES['sessionid']) == 0:
                    response, code = create_response(
                        401, 'Unauthorized', {
                            "message": 'User not in session'
                        }
                    )
                    return HttpResponse(json.dumps(response), status=code)

                if not user:
                    response, code = create_response(
                        401, 'Unauthorized', {
                            "message": 'User not found'
                        }
                    )
                    return HttpResponse(json.dumps(response), status=code)

                if tokenUser.email != user.email:
                    response, code = create_response(
                        401, {
                            "message": 'Access not match'
                        }
                    )
                    return HttpResponse(json.dumps(response), status=code)

                """if request.user.email != user.email:
                        response, code = create_response(
                            401, {
                                "message": 'Access not match'
                            }
                        )
                        return HttpResponse(json.dumps(response), status=code)"""
                request.user = user
                return None
            except (InvalidToken, AuthenticationFailed, TokenBackendError, TokenError, exceptions.ValidationError, exceptions.APIException, exceptions.PermissionDenied):
                if ('refresh-token' in request.session):
                    token = RefreshToken(request.session['refresh-token'])
                    response, code = create_response(
                        200, 'Unauthorized', {"token": f"{token.access_token}"})
                    return HttpResponse(json.dumps(response), status=code)
                response, code = create_response(
                    401, 'Unauthorized', {"message": ["Authorization has failed, Please send valid token."]})
                logger.info(f"Response {response}")
                return HttpResponse(json.dumps(response), status=code)
            except Exception as e:
                return HttpResponse(e.args,status=400)
        else:
            response, code = create_response(
                401, 'Unauthorized', {
                    "message": "Authorization not found, Please send valid token"}
            )
            logger.info(f"Response {response}")
            return HttpResponse(json.dumps(response), status=code)

    def process_response(self, request, response):
        return response
