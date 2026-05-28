import uuid
from django.contrib.postgres.fields import ArrayField
from django.db import models
from .product_media import ProductImage
from .product_assets import ProductAsset
from .product_license import ProductLicense
import uuid
from django.contrib.postgres.fields import ArrayField
from django.db import models


class ProductStatus(models.TextChoices):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    ARCHIVED = "ARCHIVED"


class Product(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    owner = models.ForeignKey(
        "users.User", on_delete=models.CASCADE, related_name="products"
    )

    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True)

    description = models.TextField()
    price_cents = models.IntegerField()
    included = ArrayField(models.TextField(), default=list)

    status = models.CharField(
        max_length=20, choices=ProductStatus.choices, default=ProductStatus.DRAFT
    )
    is_featured = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # M2M relations – now directly defined (cleaner, same DB tables)
    tags = models.ManyToManyField(
        "tag.Tag",
        related_name="products",
        db_table="product_tags",
    )
    categories = models.ManyToManyField(
        "category.Category",
        related_name="products",
        db_table="product_categories",
    )

    class Meta:
        db_table = "products"
        indexes = [
            models.Index(fields=["owner", "status"]),
            models.Index(fields=["status", "-created_at"]),
        ]

    def __str__(self):
        return self.name
