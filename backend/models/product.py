from datetime import datetime

from sqlalchemy import (
    String,
    Integer,
    DateTime,
    text,
    Text,
    func,
    ForeignKey,
    Enum,
    Boolean,
    JSON,
)
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column
import uuid
import enum

from database.postgresql import Base


class StatusEnum(str, enum.Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    ARCHIVED = "ARCHIVED"


class Product(Base):
    __tablename__ = "product"
    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()")
    )
    user_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("user.id", ondelete="CASCADE")
    )
    name: Mapped[str] = mapped_column(String(100))
    slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    description: Mapped[str] = mapped_column(Text())
    price_cent: Mapped[int] = mapped_column(Integer())
    included: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
    status: Mapped[StatusEnum] = mapped_column(server_default=text("'DRAFT'"))
    is_featured: Mapped[bool] = mapped_column(Boolean(), server_default=text("false"))
    created_at: Mapped[datetime] = mapped_column(
        DateTime(), default=func.now(), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(),
        default=func.now(),
        server_default=func.now(),
        server_onupdate=func.now(),
    )
