from uuid import UUID
from django.db import transaction
from api.orders.domain.order import Order, OrderItem
from api.orders.mappers.order_mapper import OrderMapper
from api.orders.models import Order as OrderModel, OrderItem as OrderItemModel


class OrderRepository:

    @transaction.atomic
    def create_order(self, order: Order) -> Order:
        order_model = OrderMapper.to_order_model(order)
        order_model.save()

        item_models = []
        for item in order.items:
            item_model = OrderMapper.to_item_model(item, order_model)
            item_models.append(item_model)

        OrderItemModel.objects.bulk_create(item_models)

        # Return domain with DB‑assigned IDs
        return OrderMapper.order_to_domain(order_model)

    def get_by_id(self, order_id: UUID) -> Order:
        model = OrderModel.objects.prefetch_related("items").get(pk=order_id)
        return OrderMapper.order_to_domain(model)

    def update_status(self, order_id: UUID, new_status: str) -> None:
        OrderModel.objects.filter(pk=order_id).update(status=new_status)
