from datetime import datetime

from sqlalchemy import String, Integer, DateTime, text, Text, func
from sqlalchemy.orm import Mapped, mapped_column
import uuid

from database.postgresql import Base
from fastapi_users_db_sqlalchemy import (
    SQLAlchemyBaseUserTableUUID,
    SQLAlchemyUserDatabase,
)


class User(SQLAlchemyBaseUserTableUUID, Base):
    username: Mapped[str] = mapped_column(Text())
    first_name: Mapped[str] = mapped_column(String(225))
    last_name: Mapped[str] = mapped_column(String(255))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    last_login: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )


# class User(Base):
#     __tablename__ = "user"
#
#     id: Mapped[uuid.UUID] = mapped_column(
#         primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()")
#     )
#     email: Mapped[str] = mapped_column(String(100), unique=True, index=True)
#     username: Mapped[str] = mapped_column(Text())
#     first_name: Mapped[str] = mapped_column(String(225))
#     last_name: Mapped[str] = mapped_column(String(255))
#     password: Mapped[str] = mapped_column(Text())
#     created_at: Mapped[datetime] = mapped_column(
#         DateTime(timezone=True), server_default=func.now()
#     )
#     last_login: Mapped[datetime] = mapped_column(
#         DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
#     )
