import uuid
from django.db import models


class OrderStatus(models.TextChoices):
    PENDING = "PENDING"
    PAID = "PAID"
    FAILED = "FAILED"
    CANCELLED = "CANCELLED"


class Order(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user = models.ForeignKey(
        "users.User", on_delete=models.CASCADE, related_name="orders"
    )

    total_cents = models.IntegerField()

    status = models.CharField(
        max_length=20, choices=OrderStatus.choices, default=OrderStatus.PENDING
    )

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "orders"
        indexes = [
            models.Index(fields=["user", "status"]),
        ]

    def __str__(self):
        return f"Order {self.id}"


class OrderItem(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    order = models.ForeignKey(
        "orders.Order", on_delete=models.CASCADE, related_name="items"
    )

    product = models.ForeignKey("products.Product", on_delete=models.PROTECT)

    price_cents = models.IntegerField()

    product_name = models.CharField(max_length=255)

    license_type = models.CharField(max_length=20, default="PERSONAL")

    class Meta:
        db_table = "order_items"
