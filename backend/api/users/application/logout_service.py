from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError

from api.users.domain.exceptions import ValidationError


class LogoutService:

    def logout(self, refresh_token: str):

        try:
            token = RefreshToken(refresh_token)

            # blacklist token
            token.blacklist()

        except TokenError:
            raise ValidationError("Invalid or expired refresh token")
