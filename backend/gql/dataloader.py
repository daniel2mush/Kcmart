from unittest import result

from strawberry.dataloader import DataLoader
from sqlalchemy.ext.asyncio import AsyncSession

from sql.asset_quries import get_asset_with_id
from sql.category_queries import get_categories_by_ids
from sql.image_quries import get_images_with_id
from sql.tag_queries import get_tag_by_ids


async def load_by_ids(
    db: AsyncSession,
    query,
    keys,
    key_field="id",
):
    result = await db.execute(query, {"ids": keys})

    rows = result.mappings().all()

    lookup = {row[key_field]: row for row in rows}

    return [lookup.get(key) for key in keys]


def create_tag_loader(db: AsyncSession):

    return DataLoader(load_fn=lambda keys: load_by_ids(db, get_tag_by_ids, keys))


def create_category_loader(db: AsyncSession):
    return DataLoader(load_fn=lambda keys: load_by_ids(db, get_categories_by_ids, keys))


def create_image_loader(db: AsyncSession):
    return DataLoader(load_fn=lambda keys: load_by_ids(db, get_images_with_id, keys))


def create_asset_loader(db: AsyncSession):
    return DataLoader(
        load_fn=lambda keys: load_by_ids(db, query=get_asset_with_id, keys=keys)
    )
