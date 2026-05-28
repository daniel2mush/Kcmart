from api.products.domain.product import Product


class ProductResponseMapper:

    @staticmethod
    def to_dto(domain: Product):
        return {
            "id": str(domain.id),
            "owner_id": str(domain.owner_id),
            "name": domain.name,
            "slug": domain.slug,
            "description": domain.description,
            "price_cents": domain.price_cents,
            "status": domain.status,
            "is_featured": domain.is_featured,
            "included": domain.included,
            "tags": [str(t) for t in domain.tag_ids],
            "categories": [str(c) for c in domain.category_ids],
            "images": [str(i) for i in domain.image_ids],
            "assets": [str(a) for a in domain.asset_ids],
        }

    @staticmethod
    def to_dto_list(products):
        return [ProductResponseMapper.to_dto(p) for p in products]
