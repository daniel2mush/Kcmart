import uuid

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi_users import FastAPIUsers

from authentication.auth import auth_backend
from authentication.manager import get_user_manager
from exceptions.base import AppException
from gql.dependency import graphql_context
from models import User
from fastapi.responses import JSONResponse
from fastapi.requests import Request

from repository.user_repo import fastapi_users
from routes import tag, category, product

from schemas.user_schema import UserRead, UserCreate, UserUpdate
from strawberry.fastapi import GraphQLRouter
from gql.schema import schema

app = FastAPI()

graphql_app = GraphQLRouter(schema, context_getter=graphql_context)

app.include_router(graphql_app, prefix="/graphql")


@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"error_code": exc.error_code, "message": exc.message},
    )


# Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://kcmart.netlify.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.include_router(tag.router)
# app.include_router(category.router)
# app.include_router(product.router)
# Exceptions

# fastapi_users = FastAPIUsers[User, uuid.UUID](
#     get_user_manager,
#     [auth_backend],
# )

# Routes
# 1. Login / Logout routes
app.include_router(
    fastapi_users.get_auth_router(auth_backend), prefix="/auth/jwt", tags=["auth"]
)

# 2. Registration routes (pass the custom schemas here)
app.include_router(
    fastapi_users.get_register_router(UserRead, UserCreate),
    prefix="/auth",
    tags=["auth"],
)

# 3. User Management routes (and here)
app.include_router(
    fastapi_users.get_users_router(UserRead, UserUpdate),
    prefix="/users",
    tags=["users"],
)
