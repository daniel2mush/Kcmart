from fastapi import Depends, APIRouter
from sqlalchemy.ext.asyncio import AsyncSession
from database.postgresql import get_db
from typing import Annotated

from schemas.user_schema import UserResponse, UserCreate
from repository.user_repo import create_user_in_db

router = APIRouter(prefix="/user", tags=["Users"])


# @router.post("/create", response_model=UserResponse)
# async def create_user(user: UserCreate, db: Annotated[AsyncSession, Depends(get_db)]):
#     result = await create_user_in_db(user, db)
#     return result
