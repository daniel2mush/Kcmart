from api.products.domain.product import Product
from api.products.models import Product as ProductModel


class ProductMapper:

    @staticmethod
    def to_domain(model: ProductModel) -> Product:
        return Product(
            id=model.id,
            owner_id=model.owner_id,
            name=model.name,
            slug=model.slug,
            description=model.description,
            price_cents=model.price_cents,
            status=model.status,
            is_featured=model.is_featured,
            # Updated to use the actual M2M relations
            tag_ids=list(model.tags.values_list("id", flat=True)),
            category_ids=list(model.categories.values_list("id", flat=True)),
            image_ids=list(model.images.values_list("id", flat=True)),
            asset_ids=list(model.assets.values_list("id", flat=True)),
            included=list(model.included),
        )

    @staticmethod
    def to_model(domain: Product) -> ProductModel:
        """Creates a new ProductModel instance from a domain object (not saved yet)."""
        return ProductModel(
            id=domain.id,
            owner_id=domain.owner_id,
            name=domain.name,
            slug=domain.slug,
            description=domain.description,
            price_cents=domain.price_cents,
            status=domain.status,
            is_featured=domain.is_featured,
            included=domain.included or [],
        )

    @staticmethod
    def apply_to_model(domain: Product, model: ProductModel) -> ProductModel:
        """Updates an existing model in-place with domain data."""
        model.owner_id = domain.owner_id
        model.name = domain.name
        model.slug = domain.slug
        model.description = domain.description
        model.price_cents = domain.price_cents
        model.status = domain.status
        model.is_featured = domain.is_featured
        model.included = domain.included
        return model
