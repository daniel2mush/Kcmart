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


class Tag(Base):
    __tablename__ = "tag"
    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()")
    )
    name: Mapped[str] = mapped_column(String(50), unique=True)


class TagList(Base):
    __tablename__ = "tag_list"
    tag_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("tag.id", ondelete="CASCADE"), primary_key=True
    )
    product_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("product.id", ondelete="CASCADE"), primary_key=True
    )
