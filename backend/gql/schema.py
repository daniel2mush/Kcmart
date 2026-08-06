import strawberry

from gql.mutation.product import ProductMutation
from gql.query.category import CategoryQuery
from gql.query.product import ProductQuery
from gql.query.tag import TagQuery


@strawberry.type
class Query(ProductQuery, CategoryQuery, TagQuery):
    pass


@strawberry.type()
class Mutation(ProductMutation):
    pass


schema = strawberry.Schema(query=Query, mutation=Mutation)
