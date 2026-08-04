import uuid
from typing import Optional
import strawberry


@strawberry.type
class Product:
    id: uuid.UUID
    name: str
    slug: str
    description: str
    price_cent: int
    included: list[str]
    status: str
    is_featured: bool
    images: list[str] | None = None
    asset_url: str | None = None
    tags: list[str] | None = None
    categories: list[str] | None = None
    user_id: Optional[uuid.UUID] = None
