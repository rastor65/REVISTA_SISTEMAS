from rest_framework.response import Response
from rest_framework.utils.serializer_helpers import ReturnDict


def create_response(code, message, data, request_id='',):

    try:
        req = str(request_id)
        if code != 200:
            proccess_data = data
            if type(data) is list and len(data) > 0:
                proccess_data = [{x: data[x][0]} for x in data][0]
            if type(data) is dict:
                proccess_data = [{x: data[x]} for x in data][0]
            if type(data) is ReturnDict:
                proccess_data = [{x: data[x]['non_field_errors'][0] if "non_field_errors" in data[x]  else data[x][0]} for x in data][0]
            data_parse = {'ok': False, "message":message,"errors": {
                'error': proccess_data}, "request_id": req}
            return data_parse, code

        data_parse = {'ok': True,
                      'message':message,
                      'data': data, "request_id": req}
        return data_parse, code
    except (Exception,BaseException) as creation_error:
        return Response({creation_error}, status=code)
