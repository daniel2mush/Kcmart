import uuid
from datetime import datetime
from typing import Optional
import strawberry


@strawberry.type
class Tag:
    id: uuid.UUID
    name: str


@strawberry.type
class Category:
    id: uuid.UUID
    name: str
    slug: str


@strawberry.type
class Images:
    id: uuid.UUID
    url: str
    position: int


@strawberry.type
class Asset:
    id: uuid.UUID
    url: str


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
    created_at: datetime
    updated_at: datetime

    image_ids: strawberry.Private[list[uuid.UUID]]
    asset_id: strawberry.Private[uuid.UUID]

    # This is the hidden field used internally

    tag_ids: strawberry.Private[list[uuid.UUID]]

    category_ids: strawberry.Private[list[uuid.UUID]]

    user_id: uuid.UUID | None = None

    @strawberry.field(description="Tags")
    async def tags(self, info: strawberry.Info) -> list[Tag] | None:

        loader = info.context.tag_loader

        return await loader.load_many(self.tag_ids)

    @strawberry.field(description="Categories")
    async def categories(self, info: strawberry.Info) -> list[Category] | None:
        loader = info.context.category_loader
        return await loader.load_many(self.category_ids)

    @strawberry.field(description="Images")
    async def images(self, info: strawberry.Info) -> list[Images] | None:
        loader = info.context.image_loader
        return await loader.load_many(self.image_ids)

    @strawberry.field(description="Asset")
    async def asset(self, info: strawberry.Info) -> Asset | None:
        loader = info.context.asset_loader
        return await loader.load(self.asset_id)
