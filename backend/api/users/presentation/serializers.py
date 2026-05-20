from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework.exceptions import AuthenticationFailed


from ..models import User


from rest_framework import serializers


class UserSerializer(serializers.Serializer):
    first_name = serializers.CharField()
    last_name = serializers.CharField()
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def __str__(self):
        return self.email

    def validate_email(self, value: str):
        if value:
            # 1. Format the email
            value = value.lower().strip()

            # 2. NEW: Check if it already exists in the database
            if User.objects.filter(email=value).exists():
                raise serializers.ValidationError(
                    "A user with this email already exists."
                )

        return value


class CustomLoginSerializer(TokenObtainPairSerializer):

    def validate(self, attrs):
        attrs["email"] = attrs["email"].lower().strip()

        data = super().validate(attrs)

        user = self.user

        if not user.is_active:
            raise AuthenticationFailed("User is disabled")

        return data


class PublicUserSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    first_name = serializers.CharField()
    last_name = serializers.CharField()
