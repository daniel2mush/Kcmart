import strawberry

from gql.types import Category
from repository.category_repo import get_categories


@strawberry.type
class CategoryQuery:
    @strawberry.field(description="Get allCategories")
    async def categories(self, info: strawberry.Info) -> list[Category]:

        db = info.context.db
        user = info.context.current_user

        if not user:
            raise Exception("Authentication required")

        categories = await get_categories(db)

        return [Category(**category) for category in categories]
