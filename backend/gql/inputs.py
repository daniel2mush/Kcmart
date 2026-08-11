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
    id: uuid.UUID
    name: str | None = None
    description: str | None = None
    price_cent: int | None = None
    included: list[str] | None = None
    tag_ids: list[uuid.UUID]
    categories_ids: list[uuid.UUID]


@strawberry.input
class PublishProductInput:
    slug: str
