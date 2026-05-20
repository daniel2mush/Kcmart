from rest_framework_simplejwt.serializers import TokenRefreshSerializer
from rest_framework_simplejwt.exceptions import InvalidToken

from api.users.application.dtos.token_refresh_results import TokenRefreshResult


class TokenService:

    def refresh_access_token(
        self,
        refresh_token: str,
    ) -> TokenRefreshResult:

        serializer = TokenRefreshSerializer(data={"refresh": refresh_token})

        serializer.is_valid(raise_exception=True)

        validated = serializer.validated_data

        return TokenRefreshResult(
            access_token=validated["access"],
            refresh_token=validated.get("refresh"),
        )
