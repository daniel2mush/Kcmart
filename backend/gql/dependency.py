from typing import Annotated

from fastapi import Depends
from starlette.requests import Request

from dependencies.initials import DB_Connect, user, user_optional
from gql.context import Context
from gql.schema import schema
from models import User
from repository.user_repo import optional_current_user


async def graphql_context(
    request: Request,
    db: DB_Connect,
    current_user: Annotated[User | None, Depends(optional_current_user)],
):

    # print(schema.as_str())

    return Context(
        request=request,
        db=db,
        current_user=current_user,
    )
