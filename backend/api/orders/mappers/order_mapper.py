from uuid import UUID
from api.orders.domain.order import Order, OrderItem
from api.orders.models import Order as OrderModel, OrderItem as OrderItemModel


class OrderMapper:

    @staticmethod
    def order_to_domain(model: OrderModel) -> Order:
        items = []
        for item_model in model.items.all():
            items.append(OrderMapper.item_to_domain(item_model))
        return Order(
            id=model.id,
            user_id=model.user_id,
            items=items,
            status=model.status,
            total_cents=model.total_cents,
        )

    @staticmethod
    def item_to_domain(model: OrderItemModel) -> OrderItem:
        return OrderItem(
            id=model.id,
            product_id=model.product_id,
            license_type=model.license_type,
            price_cents=model.price_cents,
            product_name=model.product_name,
        )

    @staticmethod
    def to_order_model(order: Order) -> OrderModel:
        return OrderModel(
            id=order.id,
            user_id=order.user_id,
            total_cents=order.total_cents,
            status=order.status,
        )

    @staticmethod
    def to_item_model(item: OrderItem, order_model: OrderModel) -> OrderItemModel:
        return OrderItemModel(
            id=item.id,
            order=order_model,
            product_id=item.product_id,
            product_name=item.product_name,
            license_type=item.license_type,
            price_cents=item.price_cents,
            quantity=1,
        )
