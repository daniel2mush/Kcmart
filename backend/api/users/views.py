import dataclasses
from dataclasses import dataclass

from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from api.users import domains, serializers, service
from api.users.domains import UserDataClass
from api.users.serializers import UserSerializer

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

        print(serialized_output.data, "Valid data")

        # 5. Return the primitive dictionary data via .data
        return Response(data=serialized_output.data, status=status.HTTP_201_CREATED)
