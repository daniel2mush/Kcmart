import uuid
from django.db import models


class PaymentStatus(models.TextChoices):
    INITIATED = "INITIATED"
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"
    REFUNDED = "REFUNDED"


class Payment(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    order = models.ForeignKey(
        "orders.Order", on_delete=models.CASCADE, related_name="payments"
    )

    provider = models.CharField(max_length=50)  # PayPal, Stripe
    provider_reference = models.CharField(max_length=255, unique=True)

    amount_cents = models.IntegerField()

    status = models.CharField(
        max_length=20, choices=PaymentStatus.choices, default=PaymentStatus.INITIATED
    )

    # New fields for better payment tracking
    failure_reason = models.TextField(blank=True)  # store error from gateway
    retry_count = models.PositiveSmallIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "payments"
        indexes = [
            models.Index(fields=["order", "-created_at"]),
        ]

    def __str__(self):
        return f"Payment {self.provider_reference} ({self.status})"
