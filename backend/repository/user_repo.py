# users.py
import uuid
from fastapi_users import FastAPIUsers

from authentication.auth import auth_backend
from authentication.manager import get_user_manager
from models import User

# Import your database model, manager, and auth backend

# 1. Initialize the instance here
fastapi_users = FastAPIUsers[User, uuid.UUID](
    get_user_manager,
    [auth_backend],
)

# 2. Export your dependencies from here
current_active_user = fastapi_users.current_user(active=True)
current_superuser = fastapi_users.current_user(active=True, superuser=True)
