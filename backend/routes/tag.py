import uuid

from fastapi import Depends, APIRouter, status

from dependencies.initials import DB_Connect, admin, user
from models import User
from repository.user_repo import current_active_user
from schemas.tag import TagResponse, TagCreate, TagUpdate
from typing import Annotated
from sqlalchemy.ext.asyncio import AsyncSession
from database.postgresql import get_db
from repository.tag_repo import create_tag, update_tag, get_tags, delete_tag

router = APIRouter(prefix="/tag", tags=["Tag"])


@router.get("/all")
async def get(db: DB_Connect,  current_user:user):
    return await get_tags(db=db)


@router.post("/create", response_model=TagResponse)
async def create_new_tag(
    tag: TagCreate,
    db: DB_Connect,
    user: admin,
):
    tag = await create_tag(tag=tag, db=db)
    return tag


@router.patch("/{tag_id}")
async def update(
    tag_id: uuid.UUID, current_user: admin, tag: TagUpdate, db: DB_Connect
):
    return await update_tag(tag_id=tag_id, db=db, value=tag.name)


@router.delete("/{tag_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete(tag_id: uuid.UUID, current_user: admin, db: DB_Connect):
    await delete_tag(tag_id=tag_id, db=db)
    return None
