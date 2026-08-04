from starlette.requests import Request

from dependencies.initials import DB_Connect, user
from gql.context import Context


async def graphql_context(
    request: Request,
    db: DB_Connect,
    current_user: user,
):

    return Context(
        request=request,
        db=db,
        current_user=current_user,
    )
