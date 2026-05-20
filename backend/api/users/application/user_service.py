from uuid import UUID

from api.users.infrastructure.user_repo import UserRepo
from api.users.domain.user import User
from api.users.models import User as UserModel
from api.users.domain.exceptions import UserNotFoundError
from api.users.domain.exceptions import ValidationError
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError as RestValidationError


from api.users.domain.exceptions import PasswordValidationError
from ..mappers.user_mappers import UserMapper
from django.contrib.auth.password_validation import validate_password


class UserService:
    def __init__(self):
        self.repo = UserRepo()

    def create_user(self, data):

        raw_password = data.pop("password")

        # Validates password
        try:
            validate_password(raw_password)
        except DjangoValidationError as e:
            raise RestValidationError({"password": e.messages})

        user = User(**data)

        user.validate()

        return self.repo.save(user, raw_password)

    def update_user(self, user_email: str, data: dict):

        if data.get("id"):
            raise ValidationError("You cannot update a user id")

        if not data:
            raise ValidationError("No data provided")

        if data.get("email"):
            if self.repo.email_exists_except(data["email"], user_email):
                raise ValidationError("Email already exists")

        user = self.repo.get_by_email(user_email)

        if not user:
            raise UserNotFoundError("User not found")

        user.apply_patch(data)

        self.repo.save(user)

        return user
