from dataclasses import dataclass, field
from typing import List
from uuid import UUID, uuid4

from .exceptions import ProductValidationError

ALLOWED_PATCH_FIELDS = {
    "name",
    "slug",
    "description",
    "price_cents",
    "status",
    "is_featured",
    "included",
    "tag_ids",
    "category_ids",
    "image_ids",
    "asset_ids",
}


@dataclass
class Product:
    owner_id: UUID

    name: str
    slug: str
    description: str

    price_cents: int

    status: str
    is_featured: bool = False

    tag_ids: List[UUID] = field(default_factory=list)
    category_ids: List[UUID] = field(default_factory=list)

    image_ids: List[UUID] = field(default_factory=list)
    asset_ids: List[UUID] = field(default_factory=list)

    included: List[str] = field(default_factory=list)

    id: UUID = field(default_factory=uuid4)

    def validate(self):
        if not self.name.strip():
            raise ProductValidationError("Name is required")
        if not self.description.strip():
            raise ProductValidationError("Description is required")
        if self.price_cents <= 0:
            raise ProductValidationError("Price must be greater than 0")

        if len(self.tag_ids) == 0:
            raise ProductValidationError("At least one tag is required")
        if len(self.category_ids) == 0:
            raise ProductValidationError("At least one category is required")
        if len(self.included) == 0:
            raise ProductValidationError("At least one included item is required")

    def apply_patch(self, data: dict):
        """Only update fields that are safe to change."""
        for key in data:
            if key in ALLOWED_PATCH_FIELDS:
                setattr(self, key, data[key])
            # Optionally log or raise on unknown fields
