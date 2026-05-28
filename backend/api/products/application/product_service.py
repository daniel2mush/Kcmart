# api/products/application/product_service.py
from uuid import UUID

from api.products.domain.product import Product
from api.products.domain.exceptions import ProductValidationError
from api.products.infrastructure.product_repository import ProductRepository


class ProductService:

    def __init__(self):
        self.repo = ProductRepository()

    def create_product(self, data: dict, user_id: UUID) -> Product:
        product = Product(
            owner_id=user_id,
            name=data["name"],
            slug=data["slug"],
            description=data["description"],
            price_cents=data["price_cents"],
            status=data.get("status", "DRAFT"),
            is_featured=data.get("is_featured", False),
            tag_ids=data.get("tags", []),
            category_ids=data.get("categories", []),
            image_ids=[],  # will be set by the repo
            asset_ids=[],  # will be set by the repo
            included=data.get("included", []),
        )
        # Validate business rules (except image/asset counts – those will be checked after creation)
        product.validate()

        return self.repo.create_product(
            product=product,
            image_urls=data.get("images", []),
            asset_urls=data.get("assets", []),
        )

    def get_product_by_id(self, product_id: UUID) -> Product:
        return self.repo.get_by_id(product_id)

    def get_all_user_products(self, user_id: UUID) -> list[Product]:
        return self.repo.list_by_user(user_id)

    def get_all_products(self) -> list[Product]:
        return self.repo.get_all_products()

    def update_product(self, product_id: UUID, data: dict) -> Product:
        product = self.repo.get_by_id(product_id)
        product.apply_patch(data)
        product.validate()
        return self.repo.save(product)
