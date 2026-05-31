from django.shortcuts import render
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.views import APIView

from api.tag.application.tag_service import TagService
from api.tag.mappers.tag_response_mappers import TagResponseMapper

# Create your views here.


class TagViewSet(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request):

        service = TagService()
        tags = service.get_all_tags()
        dto = TagResponseMapper.to_dto_list(tags)

        return Response(dto, status=status.HTTP_200_OK)
