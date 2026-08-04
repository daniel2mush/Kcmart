import strawberry

from gql.mutation.product import ProductMutation
from gql.query.product import ProductQuery


class Query(ProductQuery):
    pass


class Mutation(ProductMutation):
    pass


schema = strawberry.Schema(query=Query, mutation=Mutation)
