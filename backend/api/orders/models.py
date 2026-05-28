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
