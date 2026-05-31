from django.contrib.auth import authenticate
from django.contrib.auth.models import update_last_login
from rest_framework_simplejwt.exceptions import AuthenticationFailed
from rest_framework_simplejwt.tokens import RefreshToken

from api.users.domain.exceptions import ValidationError
from api.users.application.dtos.auth_result import AuthResult


class AuthService:

    def login(self, email: str, password: str) -> AuthResult:
        email = email.lower().strip()

        user = authenticate(email=email, password=password)

        if user is None:
            raise AuthenticationFailed("Invalid email or password")

        if not user.is_active:
            raise AuthenticationFailed("User account is disabled")

        update_last_login(None, user)

        refresh = RefreshToken.for_user(user)

        return AuthResult(
            user=user,
            access_token=str(refresh.access_token),
            refresh_token=str(refresh),
        )
