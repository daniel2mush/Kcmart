class ProductResponseMapper:

    @staticmethod
    def to_dto(product):
        return {
            "id": product.id,
            "user_id": product.user_id,
            "name": product.name,
            "price": product.price,
            "description": product.description,
            "images": product.images,
            "includes": product.includes,
            "tag": product.tag,
            "product_type": product.product_type,
        }

    @staticmethod
    def to_dto_list(products):
        return [ProductResponseMapper.to_dto(p) for p in products]
