from typing import Annotated

from fastapi import Depends
from fastapi_users_db_sqlalchemy import SQLAlchemyUserDatabase
from sqlalchemy.ext.asyncio import AsyncSession

from database.postgresql import get_db
from models import User
from repository.user_repo import (
    current_active_user,
    current_superuser,
    optional_current_user,
)

DB_Connect = Annotated[AsyncSession, Depends(get_db)]
user = Annotated[User, Depends(current_active_user)]
# admin = Annotated[User, Depends(current_superuser)]
user_optional = Annotated[User | None, Depends(optional_current_user)]
