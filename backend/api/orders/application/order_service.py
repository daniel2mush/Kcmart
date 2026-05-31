from uuid import UUID
from api.orders.domain.order import Order, OrderItem
from api.orders.infrastructure.order_repository import OrderRepository
from api.products.infrastructure.license_repository import (
    ProductLicenseRepository,
)


class OrderService:

    def __init__(self):
        self.order_repo = OrderRepository()
        self.license_repo = ProductLicenseRepository()

    def create_order(self, user_id: UUID, items_data: list[dict]) -> Order:
        """
        items_data: [{"product_id": UUID, "license_type": "PERSONAL"}, ...]
        """
        items = []
        for item_data in items_data:
            price = self.license_repo.get_price_cents(
                item_data["product_id"], item_data["license_type"]
            )
            items.append(
                OrderItem(
                    product_id=item_data["product_id"],
                    license_type=item_data["license_type"],
                    price_cents=price,
                )
            )

        order = Order(user_id=user_id, items=items)
        order.validate()
        return self.order_repo.create_order(order)
