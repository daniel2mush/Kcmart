from rest_framework.serializers import ModelSerializer
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

from .models import User


class UserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["first_name", "last_name", "email", "password"]
        extra_kwargs = {
            "password": {
                "write_only": True,  # Ensures password is never included in GET responses
                "style": {
                    "input_type": "password"
                },  # Keeps it hidden in the browsable API UI
            }
        }

    def __str__(self):
        return f"{self.email}"

    def validate_email(self, value: str):
        if value:
            return value.lower().strip()
        return value


class CustomLoginSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        if "email" in attrs and isinstance(attrs["email"], str):
            attrs["email"] = attrs["email"].lower().strip()

        return super().validate(attrs)


class PublicUserSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "first_name", "last_name"]
