from dataclasses import dataclass, field
from uuid import UUID, uuid4
from typing import Optional

from ...users.domain.exceptions import ValidationError, EmailValidationError


@dataclass()
class User:
    first_name: str
    last_name: str
    email: str
    id: UUID = field(default_factory=uuid4)

    def validate(self):
        if not self.first_name:
            raise ValidationError("First name cannot be empty")
        if not self.last_name:
            raise ValidationError("Last name cannot be empty")
        if not self.email:
            raise EmailValidationError("Email cannot be empty")

    def apply_patch(self, data: dict):
        for k, v in data.items():
            if hasattr(self, k):
                setattr(self, k, v)

    def __str__(self):
        return f"{self.id} {self.first_name} {self.last_name} {self.email}"
