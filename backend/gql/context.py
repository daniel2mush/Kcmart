from strawberry.fastapi import BaseContext
from starlette.requests import Request
from sqlalchemy.ext.asyncio import AsyncSession

from gql.dataloader import (
    create_tag_loader,
    create_category_loader,
    create_image_loader,
    create_asset_loader,
)
from models import User


class Context(BaseContext):
    def __init__(self, request: Request, db: AsyncSession, current_user: User | None):
        self.request = request
        self.db = db
        self.current_user = current_user
        self.tag_loader = create_tag_loader(db=db)
        self.category_loader = create_category_loader(db)
        self.image_loader = create_image_loader(db)
        self.asset_loader = create_asset_loader(db)
