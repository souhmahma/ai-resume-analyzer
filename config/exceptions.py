from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)

ERROR_MESSAGES = {
    400: {
        'code'   : 'BAD_REQUEST',
        'title'  : 'Invalid request',
        'message': 'The data you sent is invalid. Please check and try again.',
    },
    401: {
        'code'   : 'UNAUTHORIZED',
        'title'  : 'Authentication required',
        'message': 'Please log in to access this resource.',
    },
    403: {
        'code'   : 'FORBIDDEN',
        'title'  : 'Access denied',
        'message': 'You don\'t have permission to perform this action.',
    },
    404: {
        'code'   : 'NOT_FOUND',
        'title'  : 'Resource not found',
        'message': 'The resource you\'re looking for doesn\'t exist.',
    },
    429: {
        'code'   : 'RATE_LIMITED',
        'title'  : 'Too many requests',
        'message': 'You\'ve made too many requests. Please wait a moment.',
    },
    500: {
        'code'   : 'SERVER_ERROR',
        'title'  : 'Something went wrong',
        'message': 'Our servers encountered an error. We\'re working on it!',
    },
}

def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        status_code = response.status_code
        error_info  = ERROR_MESSAGES.get(status_code, {
            'code'   : 'ERROR',
            'title'  : 'An error occurred',
            'message': 'Something went wrong. Please try again.',
        })

        if status_code >= 500:
            logger.error(f"Server error: {exc}", exc_info=True)

        response.data = {
            'error'  : True,
            'code'   : error_info['code'],
            'title'  : error_info['title'],
            'message': error_info['message'],
            'details': response.data if DEBUG else None,
            'status' : status_code,
        }

    return response