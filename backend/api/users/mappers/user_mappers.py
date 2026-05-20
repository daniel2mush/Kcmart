from ..models import User as UserModel
from api.users.domain.user import User as DomainUser


class UserMapper:

    @staticmethod
    def to_domain(user: UserModel) -> DomainUser:
        return DomainUser(
            id=user.id,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
        )

    @staticmethod
    def to_persistence(user: DomainUser):
        return {
            "id": user.id,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
        }
