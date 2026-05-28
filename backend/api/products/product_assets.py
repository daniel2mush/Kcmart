import uuid
from django.db import models


class ProductAsset(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    product = models.ForeignKey(
        "products.Product",
        on_delete=models.CASCADE,
        related_name="assets",
    )

    file_url = models.TextField()

    # These can be populated later (after file inspection)
    filename = models.CharField(max_length=255, blank=True, default="")
    file_size = models.PositiveBigIntegerField(null=True, blank=True)
    mime_type = models.CharField(max_length=100, blank=True, default="")

    asset_type = models.CharField(max_length=20, default="SOURCE")

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "product_assets"
        # No check constraint on file_size because it may be null initially

    def __str__(self):
        return f"{self.product.name} – {self.filename or self.file_url}"
