from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status

from api.users.domain.exceptions import DomainError


def custom_exception_handler(exc, context):

    if isinstance(exc, DomainError):
        return Response(
            {
                "status": False,
                "detail": str(exc),
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    return exception_handler(exc, context)
