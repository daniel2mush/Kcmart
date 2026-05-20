from django.contrib.postgres.fields import ArrayField
from django.db import models
import uuid

from api.users.models import User

# Create your models here.

# export interface ProductTypes {
#     id: number
#     name: string
#     price: number
#     description: string
#     tags: string
#     types: types
#
#     image: string[]
#     included: tag[]
# }


# Enums


# Enums
class TypesEnums(models.TextChoices):
    TEMPLATE = "TEMPLATE", "Templates"
    MOCKUPS = "MOCKUPS", "Mockups"
    GRAPHICS = "GRAPHICS", "Graphics"
    ICONS = "ICONS", "Icons"
    FONTS = "FONTS", "Fonts"
    MODELS = "3D_MODELS", "3D Models"  # Avoid starting database values with numbers
    MAGAZINES = "MAGAZINES", "Magazines"


class ProductModel(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name="products")

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)

    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    description = models.TextField()

    images = ArrayField(models.TextField(), size=4, blank=True, default=list)

    includes = ArrayField(models.TextField(), size=4, blank=True, default=list)

    tag = models.CharField(max_length=100, blank=True, default="")

    product_type = models.CharField(
        max_length=100, choices=TypesEnums, default=TypesEnums.GRAPHICS
    )

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name
