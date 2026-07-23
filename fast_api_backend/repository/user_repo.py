from exceptions.user_exception import UserAlreadyExistException
from schemas.user_schema import UserCreate
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text, select
from fastapi import Depends
from typing import Annotated
from database.postgresql import get_db
import models
from services.auth_service import get_hashed_password


async def create_user_in_db(user: UserCreate, db: AsyncSession):

    # Check for new users, if the email exists already
    query = text("""
    SELECT 1 FROM "user" as u WHERE u.email = :email
    """)

    result = await db.execute(query, {"email": user.email})

    if result.mappings().first():
        raise UserAlreadyExistException(user.email)

    # hashing password
    hashed_password = get_hashed_password(user.password)

    # insert to db
    n_query = text("""
        INSERT INTO "user"( email, username, first_name, last_name, password)
            VALUES (:email, :username, :first_name, :last_name, :password)
            RETURNING id, email, username, first_name, last_name, last_login, created_at
        
        """)

    result = await db.execute(
        n_query,
        {
            **user.model_dump(exclude={"password"}),
            "password": hashed_password,
        },
    )
    await db.commit()
    new_user = result.mappings().first()

    # result = await db.execute(
    #     select(models.User).where(models.User.email == user.email)
    # )
    # if result.scalars().first():
    #     raise UserAlreadyExistException(user.email)
    # # hashing password
    # hashed_password = get_hashed_password(user.password)
    #
    # new_user = models.User(
    #     **user.model_dump(exclude={"password"}), password=hashed_password
    # )
    #
    # db.add(new_user)
    # await db.commit()
    # await db.refresh(new_user)
    return new_user
