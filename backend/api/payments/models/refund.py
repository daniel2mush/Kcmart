import uuid
from django.db import models


class Refund(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    payment = models.ForeignKey("payments.Payment", on_delete=models.CASCADE)

    amount_cents = models.IntegerField()

    reason = models.TextField()

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "refunds"
