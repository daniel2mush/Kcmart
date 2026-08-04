# import uuid
#
# from fastapi import Depends, APIRouter
#
# from dependencies.initials import DB_Connect, admin, user
# from repository.product_repo import (
#     create_product,
#     get_products,
#     update_product_repo,
#     delete_product,
#     get_user_products,
#     get_product_with_slug,
# )
#
# from schemas.category import CategoryResponse, CategoryCreate
#
# from repository.category_repo import create_category
# from slugify import slugify
#
# from schemas.product import (
#     ProductResponse,
#     ProductCreate,
#     ProductUpdate,
#     ProductUpdateResponse,
# )
#
# router = APIRouter(prefix="/product", tags=["Products"])
#
#
# @router.get("/all", response_model=list[ProductResponse])
# async def products(
#     current_user: user,
#     db: DB_Connect,
#     page: int = 1,  # Optional query param (defaults to 1)
#     limit: int = 10,
# ):
#     return await get_products(db=db, page=page, limit=limit)
#
#
# @router.get("/user/all", response_model=list[ProductResponse])
# async def user_products(
#     current_user: user,
#     db: DB_Connect,
#     page: int = 1,  # Optional query param (defaults to 1)
#     limit: int = 10,
# ):
#     return await get_user_products(
#         db=db, page=page, limit=limit, user_id=current_user.id
#     )
#
#
# @router.get("/{slug}", response_model=ProductResponse)
# async def get_product_slug(current_user: user, db: DB_Connect, slug: str):
#     return await get_product_with_slug(db=db, slug=slug)
#
#
# @router.post("/create", response_model=ProductResponse, status_code=200)
# async def create_new_product(product: ProductCreate, permission: user, db: DB_Connect):
#
#     slug = slugify(product.name)
#     result = await create_product(
#         product=product, user_id=permission.id, db=db, slug=slug
#     )
#     return result
#
#
# @router.patch("/{product_id}", response_model=ProductUpdateResponse)
# async def update(
#     current_user: user,
#     db: DB_Connect,
#     update_product: ProductUpdate,
#     product_id: uuid.UUID,
# ):
#
#     return await update_product_repo(
#         product_id=product_id, db=db, product=update_product, user_id=current_user.id
#     )
#
#
# @router.delete("/{product_id}", status_code=204)
# async def delete_product_with_id(
#     db: DB_Connect, current_user: user, product_id: uuid.UUID
# ):
#     await delete_product(user_id=current_user.id, product_id=product_id, db=db)
#     return None
