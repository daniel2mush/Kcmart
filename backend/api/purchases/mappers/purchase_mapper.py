from api.purchases.domain.purchase import Purchase
from api.purchases.models import Purchase as PurchaseModel


class PurchaseMapper:
    @staticmethod
    def to_domain(model: PurchaseModel) -> Purchase:
        return Purchase(
            id=model.id,
            user_id=model.user_id,
            product_id=model.product_id,
            order_id=model.order_id,
            license_type=model.license_type,
        )

    @staticmethod
    def to_model(purchase: Purchase) -> PurchaseModel:
        return PurchaseModel(
            id=purchase.id,
            user_id=purchase.user_id,
            product_id=purchase.product_id,
            order_id=purchase.order_id,
            license_type=purchase.license_type,
        )
