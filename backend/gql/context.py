from strawberry.fastapi import BaseContext
from starlette.requests import Request
from sqlalchemy.ext.asyncio import AsyncSession
from models import User


class Context(BaseContext):
    def __init__(self, request: Request, db: AsyncSession, current_user: User | None):
        self.request = request
        self.db = db
        self.current_user = current_user
