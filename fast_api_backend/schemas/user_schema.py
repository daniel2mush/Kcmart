import uuid
from datetime import datetime

from pydantic import BaseModel, EmailStr, ConfigDict

from schemas.product_schema import ProductResponse
from fastapi_users import schemas


class UserRead(schemas.BaseUser[uuid.UUID]):
    username: str
    first_name: str
    last_name: str


class UserCreate(schemas.BaseUserCreate):
    pass
    # email: str
    username: str
    first_name: str
    last_name: str
    # password: str


class UserUpdate(schemas.BaseUserUpdate):
    pass


class UserResponse(BaseModel):
    id: uuid.UUID
    email: EmailStr
    username: str
    first_name: str
    last_name: str
    last_login: datetime
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)


class UserWithProducts(UserResponse):
    products: list[ProductResponse]
