import uuid
from django.db import models
from django.utils.safestring import mark_safe


class ProductImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    product = models.ForeignKey(
        "products.Product",
        on_delete=models.CASCADE,
        related_name="images",
    )

    url = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "product_images"
        ordering = ["created_at"]  # simple ordering by creation time

    def __str__(self):
        return f"{self.product.name} Image"

    # Add this method for the thumbnail
    def image_thumbnail(self):
        if self.url:
            return mark_safe(
                f'<img src="{self.url}" width="100" height="100" '
                f'style="object-fit: cover; border-radius: 4px;" />'
            )
        return "No Image"

    image_thumbnail.short_description = "Preview"  # Column header in admin
