import strawberry

from gql.types import Tag
from repository.tag_repo import get_tags


@strawberry.type
class TagQuery:
    @strawberry.field(description="Get all tags")
    async def tags(self, info: strawberry.Info) -> list[Tag]:

        db = info.context.db
        user = info.context.current_user

        if not user:
            raise Exception("Authentication required")

        tags = await get_tags(db)

        return [Tag(**tag) for tag in tags]
