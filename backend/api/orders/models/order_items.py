from django.db import models


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
