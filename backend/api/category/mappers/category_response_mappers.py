from api.category.domain.category import Category


class CategoryResponseMapper:
    @staticmethod
    def to_dto(domain: Category):
        return {
            "id": domain.id,
            "name": domain.name,
            "slug": domain.slug,
        }

    @staticmethod
    def to_dto_list(category):
        return [CategoryResponseMapper.to_dto(d) for d in category]
