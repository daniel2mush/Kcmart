from dataclasses import dataclass
from uuid import UUID

from .models import User


@dataclass
class UserDataClass:
    first_name: str
    last_name: str
    email: str
    password: str | None = None
    id: UUID | None = None

    @classmethod
    def from_instance(cls, user: "User") -> "UserDataClass":
        return cls(
            id=user.id,
            first_name=user.first_name,
            last_name=user.last_name,
            email=user.email,
            password=None,
        )
