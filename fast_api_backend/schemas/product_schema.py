import uuid

from pydantic import BaseModel, ConfigDict


class ProductCreate(BaseModel):
    name: str
    slug: str
    description: str
    price_cent: int
    included: list[str]


class ProductResponse(BaseModel):
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
