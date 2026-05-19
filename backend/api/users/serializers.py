from rest_framework.serializers import ModelSerializer

from .models import User


class UserSerializer(ModelSerializer):

    class Meta:
        model = User
        fields = ["first_name", "last_name", "email", "password"]

    def __str__(self):
        return f'{self.email}'
