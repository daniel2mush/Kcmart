from api.products.domain.product import Product
from api.products.mappers.product_mapper import ProductMapper
from ..models import ProductModel


class ProductRepository:

    # -------- CREATE / SAVE --------
    def save(self, product: Product):
        ProductModel.objects.update_or_create(
            id=product.id, defaults=ProductMapper.to_persistence(product)
        )
        return product

    # -------- GET BY ID --------
    def get_by_id(self, pk):
        model = ProductModel.objects.get(pk=pk)
        return ProductMapper.to_domain(model)

    # -------- LIST USER --------
    def list_by_user(self, user_id):
        models = ProductModel.objects.filter(user_id=user_id)
        return [ProductMapper.to_domain(m) for m in models]

    # -------- GET ALL --------
    def get_all_products(self):
        models = ProductModel.objects.all()
        return [ProductMapper.to_domain(m) for m in models]
