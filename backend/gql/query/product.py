from typing import List

import strawberry

from gql.types import Product
from repository.product_repo import (
    get_products,
    get_user_products,
    get_product_with_slug,
)


@strawberry.type
class ProductQuery:
    @strawberry.field(description="products")
    async def products(
        self, info: strawberry.Info, page: int = 1, limit: int = 10
    ) -> List[Product]:

        user = info.context.current_user

        if not user:
            raise Exception("Authentication required")

        db = info.context.db
        products = await get_products(db=db, page=page, limit=limit)
        return [Product(**product) for product in products]

    @strawberry.field(description="user_products")
    async def user_product(
        self, info: strawberry.Info, page: int = 1, limit: int = 10
    ) -> List[Product]:

        user = info.context.current_user

        if not user:
            raise Exception("Authentication required")

        db = info.context.db
        user = info.context.current_user

        products = await get_user_products(
            db=db, user_id=user.id, limit=limit, page=page
        )

        return [Product(**p) for p in products]

    @strawberry.field(description="Product with slugs")
    async def product_with_slug(self, info: strawberry.Info, slug: str) -> Product:

        user = info.context.current_user

        if not user:
            raise Exception("Authentication required")

        db = info.context.db
        product = await get_product_with_slug(db, slug)
        return Product(**product)
