from django.shortcuts import get_object_or_404

from ..mappers.user_mappers import UserMapper
from ..models import User as UserModel

from ..domain.user import User


class UserRepo:

    def get_by_email(self, email) -> User:
        obj = UserModel.objects.get(email=email)
        return UserMapper.to_domain(obj)

    def save(self, user: User, raw_password: str | None = None) -> User:
        data = UserMapper.to_persistence(user)
        user_obj, _ = UserModel.objects.update_or_create(id=user.id, defaults=data)
        if raw_password:
            user_obj.set_password(raw_password)
            user_obj.save(update_fields=["password"])

        return UserMapper.to_domain(user_obj)

    def get_by_id(self, user_id) -> User:
        return get_object_or_404(UserModel, pk=user_id)

    def email_exists_except(self, email: str, current_email: str) -> bool:
        return (
            UserModel.objects.filter(email=email).exclude(email=current_email).exists()
        )
