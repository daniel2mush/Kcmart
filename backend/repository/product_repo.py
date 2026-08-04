import uuid

from fastapi import status
from slugify import slugify
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from aiosql import aiosql
from exceptions.base import AppException
from gql.inputs import ProductInput
from models import User
from repository.user_repo import current_active_user
from sql.product_quries import (
    check_query,
    insert_product_query,
    image_query,
    asset_query,
    tag_query,
    category_query,
    fetch_query,
    is_authorized_user,
    is_product_exist,
    update_product,
    CTE_get_all_product,
    delete_product_query,
    CTE_get_all_user_product,
    CTE_get_all_product_with_slug,
)
from schemas.product import ProductCreate, ProductUpdate
from dependencies.initials import user


async def create_product(product: ProductInput, db: AsyncSession, user_id: uuid.UUID):
    slug = slugify(product.name)
    # 1. Check if product exists
    check_result = await db.execute(check_query, {"slug": slug})

    if check_result.scalar():
        raise AppException(
            message=f"Product with this name '{product.name}' already exists",
            status_code=status.HTTP_400_BAD_REQUEST,
            error_code="PRODUCT_ALREADY_EXISTS",
        )

    # 2. Insert the Product

    # Explicitly pull only the needed fields to prevent bind parameter errors
    product_data = {
        "user_id": user_id,
        "slug": slug,
        "name": product.name,
        "description": product.description,
        "price_cent": product.price_cent,
        "included": product.included,
    }

    result = await db.execute(insert_product_query, product_data)

    # Use .scalar() to get the actual integer ID, not a dictionary
    product_id = result.scalar()

    # 3. Insert Images (Using enumerate for accurate positioning)
    if product.images:

        for index, url in enumerate(product.images):
            await db.execute(
                image_query, {"url": url, "product_id": product_id, "position": index}
            )

    # 4. Insert Asset
    if product.asset_url:

        await db.execute(
            asset_query, {"url": product.asset_url, "product_id": product_id}
        )

    # 5. Insert Tags
    if product.tag_ids:

        for tag_id in product.tag_ids:
            await db.execute(tag_query, {"tag_id": tag_id, "product_id": product_id})

    # 6. Insert Categories
    if product.categories_ids:

        for category_id in product.categories_ids:
            await db.execute(
                category_query, {"category_id": category_id, "product_id": product_id}
            )

    # 7. Commit the transaction ONCE at the end
    await db.commit()

    # 8. Fetch the newly created product with subqueries to prevent Cartesian explosions

    final_result = await db.execute(fetch_query, {"product_id": product_id})
    return final_result.mappings().first()


async def get_products(db: AsyncSession, page: int = 1, limit: int = 10):
    # Ensure page is at least 1 to avoid negative offsets
    page = max(1, page)

    # Standard 1-based pagination formula
    offset = (page - 1) * limit

    result = await db.execute(CTE_get_all_product, {"offset": offset, "limit": limit})
    products = result.mappings().all()
    return products


async def update_product_repo(
    user_id: uuid.UUID,
    db: AsyncSession,
    product_id: uuid.UUID,
    product: ProductUpdate,  # or int
):

    # If the request body was empty `{}`
    if not product:
        raise AppException(
            message="No fields provided to update",
            status_code=status.HTTP_400_BAD_REQUEST,
            error_code="NO_FIELDS_PROVIDED",
        )

    # 2. Handle slug dynamically ONLY if name was updated
    slug = slugify(product.name) if product.name else None

    # 3. Build SET clause dynamically (e.g., "name = :name, price_cent = :price_cent")
    params = {
        "id": product_id,
        "user_id": user_id,
        "name": product.name,
        "slug": slug,
        "description": product.description,
        "price_cent": product.price_cent,
        "included": product.included,
        "status": product.status,
        "is_featured": product.is_featured,
    }

    result = await db.execute(update_product, params)
    updated_product = result.mappings().first()

    if not updated_product:
        raise AppException(
            message="Product not found or you are not authorized to edit it",
            status_code=status.HTTP_404_NOT_FOUND,
            error_code="PRODUCT_NOT_FOUND",
        )

    await db.commit()
    return updated_product


async def delete_product_repo(
    db: AsyncSession, user_id: uuid.UUID, product_id: uuid.UUID
) -> bool:
    results = await db.execute(
        delete_product_query, {"user_id": user_id, "product_id": product_id}
    )
    deleted_id = results.scalar_one_or_none()

    if deleted_id is None:
        raise AppException(
            status_code=status.HTTP_404_NOT_FOUND,
            message="Product not found or not authorized to delete",
            error_code="PRODUCT_NOT_FOUND_OR_NOT_AUTHORIZED",
        )

    await db.commit()
    return True


async def get_user_products(
    db: AsyncSession, user_id: uuid.UUID, page: int = 1, limit: int = 10
):
    # Ensure page is at least 1 to avoid negative offsets
    page = max(1, page)

    # Standard 1-based pagination formula
    offset = (page - 1) * limit

    result = await db.execute(
        CTE_get_all_user_product, {"offset": offset, "limit": limit, "id": user_id}
    )
    products = result.mappings().all()
    return products


async def get_product_with_slug(db: AsyncSession, slug: str):

    result = await db.execute(CTE_get_all_product_with_slug, {"slug": slug})

    product = result.mappings().first()

    if product is None:
        raise AppException(
            message="There is no product with this slug",
            status_code=status.HTTP_400_BAD_REQUEST,
            error_code="PRODUCT_NOT_FOUND",
        )
    return product
