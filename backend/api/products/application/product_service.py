from uuid import UUID
from api.products.domain.product import Product
from api.products.infrastructure.product_repository import ProductRepository


class ProductService:

    def __init__(self):
        self.repo = ProductRepository()

    # ---------------- CREATE ----------------
    def create_product(self, data: dict, user_id: UUID):

        product = Product(user_id=user_id, **data)

        product.validate()

        return self.repo.save(product)

    # ---------------- GET ONE ----------------
    def get_product_by_id(self, product_id: UUID):
        return self.repo.get_by_id(product_id)

    # ---------------- GET ALL USER ----------------
    def get_all_user_products(self, user_id: UUID):
        return self.repo.list_by_user(user_id)

    # ---------------- GET ALL ----------------
    def get_all_products(self):
        return self.repo.get_all_products()

    # ---------------- UPDATE ----------------
    def update_product(self, product_id: UUID, data: dict):

        product = self.repo.get_by_id(product_id)

        product.apply_patch(data)

        product.validate()

        return self.repo.save(product)
