import uuid

# Remove this import: from api.products.models import Product
from django.db import models


class ProductLicense(models.Model):
    """Pricing per license type"""

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    product = models.ForeignKey(
        "products.Product",  # String reference instead of the class
        on_delete=models.CASCADE,
        related_name="licenses",
    )
    license_type = models.CharField(
        max_length=20, choices=[("PERSONAL", "Personal"), ("COMMERCIAL", "Commercial")]
    )
    price_cents = models.IntegerField()

    class Meta:
        db_table = "product_licenses"
        unique_together = ("product", "license_type")
