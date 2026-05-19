import email
import uuid
from multiprocessing.context import AuthenticationError

from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models

# Create your models here.


class UserManager(BaseUserManager):
    def create_user(
        self,
        email: str,
        first_name: str,
        last_name: str,
        password: str,
        is_staff: bool = False,
        is_superuser: bool = False,
    ):
        if email is None:
            raise AuthenticationError("Email is required")
        if last_name is None:
            raise AuthenticationError("Last name is required")
        if first_name is None:
            raise AuthenticationError("First name is required")

        user: "User" = self.model(
            email=self.normalize_email(email=email),
            first_name=first_name,
            last_name=last_name,
            is_staff=is_staff,
            is_superuser=is_superuser,
            is_active=True,
        )

        if password:
            user.set_password(password)

        user.save(using=self._db)
        return user

    def create_superuser(
        self, email: str, first_name: str, last_name: str, password: str
    ):
        return self.create_user(
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=password,
            is_staff=True,
            is_superuser=True,
        )


# Abstrac Custom user


class User(AbstractUser):
    username = None
    email = models.EmailField(verbose_name="Email", max_length=225, unique=True)
    last_name = models.CharField(verbose_name="Last name", max_length=255)
    first_name = models.CharField(verbose_name="First name", max_length=255)
    objects = UserManager()
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["last_name", "first_name"]
