import os
from dotenv import load_dotenv
from fastapi_users.authentication import (
    AuthenticationBackend,
    BearerTransport,
    JWTStrategy,
    CookieTransport,
)

load_dotenv()


cookie_transport = CookieTransport(
    cookie_name="fastapiusersauth",
    cookie_max_age=3600,
    cookie_secure=True,  # Set to True in production (requires HTTPS)
    cookie_httponly=True,  # Prevents JavaScript access to the cookie
    cookie_samesite="lax",  # CSRF protection
)


def get_jwt_strategy() -> JWTStrategy:
    return JWTStrategy(secret=str(os.getenv("SECRET_KEY")), lifetime_seconds=3600)


auth_backend = AuthenticationBackend(
    name="jwt_cookie",
    transport=cookie_transport,
    get_strategy=get_jwt_strategy,
)
