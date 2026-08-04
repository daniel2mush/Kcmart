import uuid

from fastapi import status
from slugify import slugify
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from exceptions.base import AppException
from schemas.category import CategoryCreate
from sql.category_queries import (
    get_all_categories_query,
    update_category_query,
    delete_category_query,
)


async def create_category(category: CategoryCreate, db: AsyncSession, slug: str):
    # Checking if the category already exists

    query = text("""
    SELECT 1 FROM category c WHERE c.slug = :slug
    """)

    result = await db.execute(query, {"slug": slug})

    if result.mappings().first():
        raise AppException(
            message="Category already exists",
            status_code=status.HTTP_400_BAD_REQUEST,
            error_code="CATEGORY_ALREADY_EXISTS",
        )
    # ADDING TO DB

    query = text("""
    INSERT INTO category(name, slug) 
        VALUES (:name, :slug) 
        RETURNING id, name, slug
    """)

    result = await db.execute(query, {"name": category.name, "slug": slug})

    await db.commit()
    new_category = result.mappings().first()
    return new_category


async def get_categories(db: AsyncSession):
    result = await db.execute(get_all_categories_query)
    return result.mappings().all()


async def update_category(category_id: uuid.UUID, db: AsyncSession, value: str):

    slug = slugify(value)
    result = await db.execute(
        update_category_query,
        {"id": category_id, "slug": slug, "name": value},
    )

    await db.commit()

    return result.mappings().first()


async def delete_category(category_id: uuid.UUID, db: AsyncSession):
    result = await db.execute(delete_category_query, {"id": category_id})
    if result.scalar_one_or_none() is None:
        raise AppException(
            message="Error occurred while delete this category",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            error_code="ERROR_OCCURRED",
        )
    await db.commit()
