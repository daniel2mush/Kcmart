from api.purchases.domain.purchase import Purchase
from api.purchases.infrastructure.purchase_repository import PurchaseRepository
from api.orders.infrastructure.order_repository import OrderRepository
from api.orders.mappers.order_mapper import OrderMapper


class PurchaseService:

    def __init__(self):
        self.purchase_repo = PurchaseRepository()
        self.order_repo = OrderRepository()

    def create_purchases_from_order(self, order_id):
        """
        After payment success, create Purchase records for every item in the order.
        """
        order = self.order_repo.get_by_id(order_id)
        purchases = []
        for item in order.items:
            purchases.append(
                Purchase(
                    user_id=order.user_id,
                    product_id=item.product_id,
                    order_id=order.id,
                    license_type=item.license_type,
                )
            )
        self.purchase_repo.bulk_create(purchases)
        # Optionally update order status to PAID
        self.order_repo.update_status(order_id, "PAID")
        return purchases
