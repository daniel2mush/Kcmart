# import uuid
#
# from fastapi import Depends, APIRouter, status
#
# from dependencies.initials import DB_Connect, admin, user
#
# from schemas.category import CategoryResponse, CategoryCreate, CategoryUpdate
#
# from repository.category_repo import (
#     create_category,
#     get_categories,
#     update_category,
#     delete_category,
# )
# from slugify import slugify
#
# router = APIRouter(prefix="/category", tags=["Category"])
#
#
# @router.get("/all", response_model=list[CategoryResponse])
# async def get_all_categories(current_user: user, db: DB_Connect):
#     return await get_categories(db=db)
#
#
# @router.post(
#     "/create", response_model=CategoryResponse, status_code=status.HTTP_201_CREATED
# )
# async def create_new_category(
#     category: CategoryCreate, current_user: admin, db: DB_Connect
# ):
#
#     slug = slugify(category.name)
#     result = await create_category(category=category, db=db, slug=slug)
#     return result
#
#
# @router.patch("/{category_id}", response_model=CategoryResponse)
# async def update_single_category(
#     category_id: uuid.UUID,
#     db: DB_Connect,
#     current_user: admin,
#     category: CategoryUpdate,
# ):
#     return await update_category(db=db, category_id=category_id, value=category.name)
#
#
# @router.delete("/{category_id}", status_code=204)
# async def delete(category_id: uuid.UUID, db: DB_Connect, current_user: admin):
#     await delete_category(category_id=category_id, db=db)
#     return None
