from fastapi import Depends
from fastapi_users_db_sqlalchemy import SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession

from database.postgresql import get_db
from models import User


async def get_user_db(session: AsyncSession = Depends(get_db)):
    # This wraps your async session and User model into the format fastapi-users expects
    yield SQLAlchemyUserDatabase(session, User)
