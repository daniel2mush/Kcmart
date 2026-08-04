import uuid

from pydantic import BaseModel, ConfigDict


class CategoryCreate(BaseModel):
    name: str


class CategoryResponse(BaseModel):
    id: uuid.UUID
    name: str
    slug: str
    model_config = ConfigDict(from_attributes=True)


class CategoryUpdate(CategoryCreate):
    pass
