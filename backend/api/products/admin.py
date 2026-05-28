from django.contrib import admin
from .models import Product
from .product_assets import ProductAsset
from .product_license import ProductLicense
from .product_media import ProductImage
from unfold.admin import ModelAdmin


# Register your models here.
@admin.register(Product)
class ProductAdmin(ModelAdmin):
    list_display = [
        "id",
        "owner",
        "slug",
        "name",
        "price_cents",
        "included",
        "status",
        "is_featured",
        "created_at",
        "updated_at",
    ]


@admin.register(ProductImage)
class ProductImageAdmin(ModelAdmin):
    list_display = ["image_thumbnail", "id", "product", "created_at"]  # Removed "url"
    readonly_fields = ["image_thumbnail"]  # Optional: show on edit form too


@admin.register(ProductAsset)
class ProductAssetAdmin(ModelAdmin):
    list_display = [
        "id",
        "product",
        "file_url",
        "filename",
        "file_size",
        "asset_type",
        "mime_type",
        "created_at",
    ]


@admin.register(ProductLicense)
class ProductLicenseAdmin(ModelAdmin):
    list_display = ["id", "product", "license_type", "price_cents"]
