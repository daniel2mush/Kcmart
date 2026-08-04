import uuid

import strawberry


@strawberry.input
class ProductInput:
    name: str
    description: str
    price_cent: int
    included: list[str]
    images: list[str]
    asset_url: str
    tag_ids: list[uuid.UUID]
    categories_ids: list[uuid.UUID]


@strawberry.input
class ProductUpdate:
    name: str | None = None
    description: str | None = None
    price_cent: int | None = None
    included: list[str] | None = None
    status: str | None = None
    is_featured: bool | None = None
