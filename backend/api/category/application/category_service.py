from ..infrastructure.category_repo import CategoryRepo


class CategoryService:
    def __init__(self):
        self.repo = CategoryRepo()

    def get_categories(self):
        return self.repo.get_categories()
