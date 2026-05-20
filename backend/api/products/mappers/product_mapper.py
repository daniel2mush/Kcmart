from api.products.domain.product import Product
from ..models import ProductModel


class ProductMapper:

    @staticmethod
    def to_domain(model: ProductModel) -> Product:
        return Product(
            id=model.id,
            user_id=model.user_id_id,  # IMPORTANT FIX
            name=model.name,
            price=float(model.price),
            description=model.description,
            images=list(model.images),
            includes=list(model.includes),
            tag=model.tag,
            product_type=model.product_type,
        )

    @staticmethod
    def to_persistence(domain: Product) -> dict:
        return {
            "user_id_id": domain.user_id,
            "name": domain.name,
            "price": domain.price,
            "description": domain.description,
            "images": domain.images,
            "includes": domain.includes,
            "tag": domain.tag,
            "product_type": domain.product_type,
        }
