from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.authentication import JWTAuthentication

from api.products.presentation.serializers import ProductWriteSerializer
from api.products.application.product_service import ProductService
from api.products.domain.exceptions import ProductValidationError
from api.products.mappers.product_response_mapper import ProductResponseMapper


class CreateProductView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)

    def post(self, request):
        serializer = ProductWriteSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        service = ProductService()
        product = service.create_product(serializer.validated_data, request.user.id)

        dto = ProductResponseMapper.to_dto(product)
        return Response(dto, status=status.HTTP_201_CREATED)


class GetProductByIdView(APIView):
    def get(self, request, pk):
        service = ProductService()
        product = service.get_product_by_id(pk)
        dto = ProductResponseMapper.to_dto(product)
        return Response(dto)  # Fixed: removed .data


class GetAllUserProductsView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)

    def get(self, request):
        service = ProductService()
        products = service.get_all_user_products(request.user.id)
        dto = ProductResponseMapper.to_dto_list(products)
        return Response(dto, status=status.HTTP_200_OK)


class GetAllProductsView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)

    def get(self, request):
        service = ProductService()
        products = service.get_all_products()
        dto = ProductResponseMapper.to_dto_list(products)
        return Response(dto, status=status.HTTP_200_OK)


class UpdateProductView(APIView):
    permission_classes = (IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)

    def patch(self, request, pk):
        service = ProductService()
        product = service.update_product(pk, request.data)
        dto = ProductResponseMapper.to_dto(product)
        return Response(dto)
