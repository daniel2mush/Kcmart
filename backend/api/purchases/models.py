import uuid
from django.db import models


class LicenseType(models.TextChoices):
    PERSONAL = "PERSONAL"
    COMMERCIAL = "COMMERCIAL"


class Purchase(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user = models.ForeignKey("users.User", on_delete=models.CASCADE)
    product = models.ForeignKey("products.Product", on_delete=models.CASCADE)
    order = models.ForeignKey("orders.Order", on_delete=models.SET_NULL, null=True)

    license_type = models.CharField(max_length=20, choices=LicenseType.choices)
    purchased_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "purchases"
        # Now a user can buy the same product with different licenses
        unique_together = ("user", "product", "license_type")

    def __str__(self):
        return f"{self.user} – {self.product} ({self.license_type})"
