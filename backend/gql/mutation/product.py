import uuid

import strawberry
from fastapi_users_db_sqlalchemy import SQLAlchemyBaseUserTableUUID

from gql.types import Product
from ..inputs import ProductInput, ProductUpdate
from repository.product_repo import (
    # create_product,
    # update_product_repo,
    # delete_product_repo,
    create_product,
    update_product_repo,
    delete_product_repo,
)


@strawberry.type
class ProductMutation:
    @strawberry.mutation(name="create_product")
    async def add_product(self, info: strawberry.Info, data: ProductInput) -> Product:
        db = info.context.db
        user = info.context.current_user

        new_product = await create_product(db=db, product=data, user_id=user.id)

        return Product(**new_product)

    @strawberry.mutation(description="This is to update the product")
    async def update_product(
        self, info: strawberry.Info, slug: str, data: ProductUpdate
    ) -> Product:
        db = info.context.db
        user = info.context.current_user

        updated_product = await update_product_repo(
            db=db, product=data, product_slug=slug, user_id=user.id
        )

        return Product(**updated_product)

    @strawberry.mutation(description="This is to delete a product")
    async def delete_product(self, info: strawberry.Info, slug: str) -> bool:
        db = info.context.db
        user = info.context.current_user

        res = await delete_product_repo(slug=slug, db=db, user_id=user.id)

        return res
