import dataclasses
from dataclasses import dataclass
from logging import raiseExceptions
from urllib import request
from uuid import UUID

from django.http.response import HttpResponseBase
from django.shortcuts import get_object_or_404, render
from django.template.response import SimpleTemplateResponse
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from api.users import domains, serializers, service
from api.users.domains import UserDataClass
from api.users.serializers import (
    CustomLoginSerializer,
    PublicUserSerializer,
    UserSerializer,
)
from core import settings

from .models import User

# Create your views here.


class RegisterUser(APIView):
    def post(self, request):
        print(request.data)

        # 1. Deserialize and validate incoming JSON data
        serializer = serializers.UserSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # 2. Convert to domain dataclass
        user_dc = domains.UserDataClass(**serializer.validated_data)

        # 3. Save to database using service layer
        created_user = service.create_user(user_dc)
        print(created_user, "Created User")  # Ensure this is no longer printing None!

        # 4. Serialize the created user instance back into Python primitives
        # (Make sure to use 'serializers.UserSerializer' if that is how it's imported)
        serialized_output = serializers.UserSerializer(created_user)

        # 5. Return the primitive dictionary data via .data
        return Response(data=serialized_output.data, status=status.HTTP_201_CREATED)


class CustomLoginView(TokenObtainPairView):
    serializer_class = CustomLoginSerializer

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)

        if response.status_code == 200:
            refresh_token = response.data.pop("refresh")
            access_token = response.data.pop("access")

            response.data = {
                "status": True,
                "message": "Logged in successfully",
                "access_token": access_token,
            }

            response.set_cookie(
                key="refresh_token",
                value=refresh_token,
                httponly=True,
                secure=not settings.DEBUG,
                samesite="Lax",
            )

        return response


class CustomRefreshToken(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get("refresh_token")
        if not refresh_token:
            raise InvalidToken("No valid refresh token found in cookies")
        serializer = self.get_serializer(data={"refresh": refresh_token})
        serializer.is_valid(raise_exception=True)

        new_access_token = serializer.validated_data.get("access")
        res = Response(
            {
                "status": True,
                "message": "Token successfully refreshed",
                "access_token": new_access_token,
            },
            status=status.HTTP_200_OK,
        )

        if "refresh" in serializer.validated_data:
            res.set_cookie(
                key="refresh_token",
                value=serializer.validated_data["refresh"],
                httponly=True,
                secure=not settings.DEBUG,
                samesite="Lax",
            )
        return res


class GetUserProfile(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def get(self, request: Request, pk: UUID | None = None):
        if pk == None or pk == request.user.pk:
            user_instance = request.user
            serializer = UserSerializer(user_instance)

        else:
            user_instance = get_object_or_404(User, pk=pk)
            serializer = PublicUserSerializer(user_instance)

        return Response(serializer.data, status=status.HTTP_200_OK)


class LogoutUser(APIView):
    authentication_classes = [JWTAuthentication]
    permission_classes = [IsAuthenticated]

    def post(self, request: Request):
        refresh_token = request.COOKIES.get("refresh_token")
        res = Response(
            {
                "status": True,
                "Message": "Logged out successfully",
            },
            status=status.HTTP_200_OK,
        )
        res.set_cookie(
            key="refresh_token",
            value="",
            max_age=0,
            httponly=True,
            secure=not settings.DEBUG,
            samesite="Lax",
        )

        return res
