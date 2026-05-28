from django.db import models
import uuid


class Download(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    user = models.ForeignKey("users.User", on_delete=models.CASCADE)

    product = models.ForeignKey("products.Product", on_delete=models.CASCADE)

    ip_address = models.GenericIPAddressField(null=True, blank=True)

    downloaded_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "downloads"
