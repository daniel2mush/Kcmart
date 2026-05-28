# api/products/infrastructure/product_repository.py
from uuid import UUID

from api.products.domain.product import Product
from api.products.mappers.product_mapper import ProductMapper
from api.products.models import Product as ProductModel
from api.products.product_media import ProductImage
from api.products.product_assets import ProductAsset


class ProductRepository:

    def create_product(
        self,
        product: Product,
        image_urls: list[str] = None,
        asset_urls: list[str] = None,
    ) -> Product:
        """Creates the full product aggregate: product + images + assets."""
        # 1. Persist the core product
        model = ProductMapper.to_model(product)
        model.save()
        model.tags.set(product.tag_ids)
        model.categories.set(product.category_ids)

        # 2. Create images
        image_ids = []
        for url in image_urls or []:
            img = ProductImage.objects.create(product=model, url=url)
            image_ids.append(img.id)

        # 3. Create assets
        asset_ids = []
        for url in asset_urls or []:
            asset = ProductAsset.objects.create(product=model, file_url=url)
            asset_ids.append(asset.id)

        # 4. Update the domain object with generated IDs
        product.id = model.id
        product.image_ids = image_ids
        product.asset_ids = asset_ids

        return product

    def save(self, product: Product) -> Product:
        # ... unchanged (just updates tags/categories) ...
        pass

    def get_by_id(self, pk: UUID) -> Product:
        model = ProductModel.objects.get(pk=pk)
        return ProductMapper.to_domain(model)

    def list_by_user(self, user_id: UUID) -> list[Product]:
        models = ProductModel.objects.filter(owner_id=user_id)
        return [ProductMapper.to_domain(m) for m in models]

    def get_all_products(self) -> list[Product]:
        models = ProductModel.objects.all()
        return [ProductMapper.to_domain(m) for m in models]
