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


class Category(Base):
    __tablename__ = "category"
    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True, default=uuid.uuid4, server_default=text("gen_random_uuid()")
    )
    name: Mapped[str] = mapped_column(String(100))
    slug: Mapped[str] = mapped_column(String(100), unique=True)


class CategoryList(Base):
    __tablename__ = "category_list"
    category_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("category.id", ondelete="CASCADE"), primary_key=True
    )
    product_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("product.id", ondelete="CASCADE"), primary_key=True
    )


#
# id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
# name = models.CharField(max_length=100, unique=True)
# slug = models.SlugField(unique=True)
