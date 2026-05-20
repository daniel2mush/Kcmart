from rest_framework import status, exceptions
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken

from api.users.presentation.serializers import (
    PublicUserSerializer,
    UserSerializer,
)
from core import settings

from api.users.application.auth_service import AuthService
from api.users.application.user_service import UserService
from api.users.application.logout_service import LogoutService
from api.users.application.profile_service import ProfileService
from api.users.application.token_service import TokenService
from ..mappers.user_response_mapper import to_dto


class RegisterUser(APIView):

    def post(self, request):

        serializer = UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        service = UserService()

        user = service.create_user(serializer.validated_data)

        dto = to_dto(user)

        return Response(dto, status=201)


class LoginUser(APIView):

    def post(self, request):

        email = request.data.get("email")
        password = request.data.get("password")

        service = AuthService()
        result = service.login(email=email, password=password)

        response = Response(
            {
                "status": True,
                "detail": "Login successful",
                "access_token": result.access_token,
                "user": UserSerializer(result.user).data,
            },
            status=status.HTTP_200_OK,
        )

        response.set_cookie(
            key="refresh_token",
            value=result.refresh_token,
            httponly=True,
            secure=not settings.DEBUG,
            samesite="Lax",
        )

        return response


class CustomRefreshToken(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):

        refresh_token = request.COOKIES.get("refresh_token")

        if not refresh_token:
            raise InvalidToken("No valid refresh token found")

        service = TokenService()

        result = service.refresh_access_token(refresh_token)

        response = Response(
            {
                "status": True,
                "message": "Token successfully refreshed",
                "access_token": result.access_token,
            },
            status=status.HTTP_200_OK,
        )

        # refresh rotation
        if result.refresh_token:
            response.set_cookie(
                key="refresh_token",
                value=result.refresh_token,
                httponly=True,
                secure=not settings.DEBUG,
                samesite="Lax",
            )

        return response


class GetUserProfile(APIView):

    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request: Request, pk=None):

        service = ProfileService()

        user, is_owner = service.get_profile(
            current_user=request.user,
            target_user_id=pk,
        )

        serializer = UserSerializer(user) if is_owner else PublicUserSerializer(user)

        return Response(
            serializer.data,
            status=status.HTTP_200_OK,
        )


class LogoutUser(APIView):

    authentication_classes = []
    permission_classes = []

    def post(self, request: Request):

        refresh_token = request.COOKIES.get("refresh_token")

        if refresh_token:
            service = LogoutService()
            service.logout(refresh_token)

        response = Response(
            {
                "status": True,
                "detail": "Logged out successfully",
            },
            status=status.HTTP_200_OK,
        )

        response.delete_cookie("refresh_token")

        return response


class UpdateUserView(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def patch(self, request):
        service = UserService()

        updated_user = service.update_user(user_email=request.user, data=request.data)
        dto = to_dto(updated_user)
        return Response(dto, status=status.HTTP_200_OK)
