from typing import List

from ..mappers.category_mappers import CategoryMapper
from ..models import Category as CategoryModel


class CategoryRepo:

    def get_categories(self) -> list[CategoryModel]:

        data = CategoryModel.objects.all()
        return [CategoryMapper.to_category_domain(c) for c in data]
