import os
from dotenv import load_dotenv
import redis.asyncio as aioredis
from fastapi_users.authentication import (
    AuthenticationBackend,
    CookieTransport,
    RedisStrategy,
)

load_dotenv()

# Initialize the async Redis client
# Make sure REDIS_URL is in your .env (e.g., redis://localhost:6379)
redis_url = os.getenv("REDIS_URL", "redis://localhost:6379")
redis_client = aioredis.from_url(redis_url, decode_responses=True)

# Your existing transport setup stays exactly the same!
cookie_transport = CookieTransport(
    cookie_name="fastapiusersauth",
    cookie_max_age=3600,
    cookie_secure=True,
    cookie_httponly=True,
    cookie_samesite="none",
)


# Replaced get_jwt_strategy with get_redis_strategy
def get_redis_strategy() -> RedisStrategy:
    # key_prefix adds a clean namespace in Redis for your auth sessions
    return RedisStrategy(
        redis=redis_client,
        lifetime_seconds=3600,
        key_prefix="fastapi_users_session:",
    )


auth_backend = AuthenticationBackend(
    name="redis_cookie",  # Changed name to reflect the new strategy
    transport=cookie_transport,
    get_strategy=get_redis_strategy,
)
