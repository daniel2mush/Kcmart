from api.category.models import Category as CategoryModel
from ..domain.category import Category


class CategoryMapper:
    @staticmethod
    def to_category_domain(data: CategoryModel) -> Category:
        return Category(
            id=data.id,
            name=data.name,
            slug=data.slug,
        )

    @staticmethod
    def to_model(data: Category) -> CategoryModel:
        return CategoryModel(
            id=data.id,
            name=data.name,
            slug=data.slug,
        )

    @staticmethod
    def apply_to_model(domain: Category, model: CategoryModel) -> CategoryModel:

        model.name = domain.name
        model.slug = domain.slug
        return model
