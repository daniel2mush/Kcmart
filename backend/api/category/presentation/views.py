from rest_framework.response import Response
from ..application.category_service import CategoryService
from ..mappers.category_response_mappers import CategoryResponseMapper
from ..presentation.serializers import CategorySerializer
from rest_framework import views, status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

# Create your views here.


class GetCategoriesViewSet(views.APIView):
    authentication_classes = (JWTAuthentication,)
    permission_classes = (IsAuthenticated,)

    def get(self, request):
        service = CategoryService()

        categories = service.get_categories()

        dto = CategoryResponseMapper.to_dto_list(categories)
        return Response(dto, status=status.HTTP_200_OK)
