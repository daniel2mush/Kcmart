import uuid
from typing import Optional

from pydantic import BaseModel, ConfigDict


class ProductCreate(BaseModel):
    name: str
    description: str
    price_cent: int
    included: list[str]
    images: list[str]
    asset_url: str
    tag_ids: list[uuid.UUID]
    categories_ids: list[uuid.UUID]


class ProductResponse(BaseModel):
    id: uuid.UUID
    name: str
    slug: str
    description: str
    price_cent: int
    included: list[str]
    status: str
    is_featured: bool
    images: list[str]
    asset_url: str
    tags: list[str]
    categories: list[str]
    model_config = ConfigDict(from_attributes=True)


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price_cent: Optional[int] = None
    included: Optional[list[str]] = None
    status: Optional[str] = None
    is_featured: Optional[bool] = None


class ProductUpdateResponse(BaseModel):
    id: uuid.UUID
    name: str
    slug: str
    description: str
    price_cent: int
    included: list[str]
    status: str
    is_featured: bool
    model_config = ConfigDict(from_attributes=True)


# name: Mapped[str] = mapped_column(String(100))
#     slug: Mapped[str] = mapped_column(String(255), unique=True, index=True)
#     description: Mapped[str] = mapped_column(Text())
#     price_cent: Mapped[int] = mapped_column(Integer())
#     included: Mapped[list[str]] = mapped_column(ARRAY(String), default=list)
#     status: Mapped[StatusEnum] = mapped_column(default=StatusEnum.DRAFT)
#     is_featured: Mapped[bool] = mapped_column(B
