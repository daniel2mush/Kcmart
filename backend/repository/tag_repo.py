import uuid

from fastapi import status
from slugify import slugify
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text

from exceptions.base import AppException
from schemas.tag import TagCreate
from sql.tag_queries import get_all_tag_query, update_tag_query, delete_tag_query


async def create_tag(tag: TagCreate, db: AsyncSession):
    # check if the tag already exists

    query = text("""
    SELECT 1 FROM tag t WHERE t.name = :name
    """)

    result = await db.execute(query, {"name": tag.name})
    if result.mappings().first():
        raise AppException(
            message="Tag already exists with this name",
            status_code=status.HTTP_400_BAD_REQUEST,
            error_code="TAG_ALREADY_EXIST",
        )

    # ADD TO DB
    query = text("""
    INSERT INTO tag(name)
        VALUES (:name)
        RETURNING id, name
    """)

    result = await db.execute(query, {"name": tag.name})
    await db.commit()
    new_tag = result.mappings().first()
    return new_tag


async def get_tags(db: AsyncSession):
    result = await db.execute(get_all_tag_query)
    return result.mappings().all()


async def update_tag(tag_id: uuid.UUID, db: AsyncSession, value: str):

    slug = slugify(value)
    result = await db.execute(
        update_tag_query,
        {"id": tag_id, "name": value},
    )

    await db.commit()

    return result.mappings().first()


async def delete_tag(tag_id: uuid.UUID, db: AsyncSession):
    result = await db.execute(delete_tag_query, {"id": tag_id})
    if result.scalar_one_or_none() is None:
        raise AppException(
            message="Error occurred while delete this tag",
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            error_code="ERROR_OCCURRED",
        )
    await db.commit()
