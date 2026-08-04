# manager.py
import uuid
from typing import Optional
from fastapi import Depends, Request
from fastapi_users import BaseUserManager, UUIDIDMixin

from dependencies.user import get_user_db

# Import your database model and get_user_db dependency
# from db import User, get_user_db
from models import User

SECRET = "YOUR_SUPER_SECRET_KEY"


class UserManager(UUIDIDMixin, BaseUserManager[User, uuid.UUID]):
    reset_password_token_secret = SECRET
    verification_token_secret = SECRET

    async def on_after_register(self, user: User, request: Optional[Request] = None):
        # Triggered right after a user successfully registers
        print(f"User {user.id} has registered.")


async def get_user_manager(user_db=Depends(get_user_db)):
    yield UserManager(user_db)
