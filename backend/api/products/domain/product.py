from dataclasses import dataclass, field
from typing import List, Optional
from uuid import UUID, uuid4

from .exceptions import ProductValidationError


@dataclass
class Product:
    user_id: UUID
    name: str
    price: float
    description: str
    images: List[str]
    includes: List[str]
    tag: str
    product_type: str
    id: UUID = field(default_factory=uuid4)

    def validate(self):
        if not self.name:
            raise ProductValidationError("Name is required")

        if self.price <= 0:
            raise ProductValidationError("Price must be > 0")

        if len(self.images) > 4:
            raise ProductValidationError("Max 4 images allowed")

        if len(self.includes) > 4:
            raise ProductValidationError("Max 4 includes allowed")

    def apply_patch(self, data: dict):
        for k, v in data.items():
            if hasattr(self, k):
                setattr(self, k, v)

    def __str__(self):
        return f"{self.name} {str(self.price)} {self.description} {self.images} {self.includes} {self.tag} {self.id} {self.product_type}"
