from django.contrib import admin
from django.utils.html import format_html

from api.admin_helpers import cents_to_dollars, short_uuid, status_badge
from .models import Product
from .product_assets import ProductAsset
from .product_license import ProductLicense
from .product_media import ProductImage
from unfold.admin import ModelAdmin


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 0
    fields = ["image_thumbnail", "url", "created_at"]
    readonly_fields = ["image_thumbnail", "created_at"]


class ProductAssetInline(admin.TabularInline):
    model = ProductAsset
    extra = 0
    fields = ["filename", "asset_type", "file_size", "mime_type", "file_url", "created_at"]
    readonly_fields = ["created_at"]


@admin.register(Product)
class ProductAdmin(ModelAdmin):
    list_display = [
        "short_id",
        "name",
        "owner",
        "formatted_price",
        "status_label",
        "is_featured",
        "category_list",
        "tag_list",
        "asset_count",
        "image_count",
        "created_at",
    ]
    list_filter = ["status", "is_featured", "categories", "tags", "created_at"]
    search_fields = ["name", "slug", "description", "owner__email", "owner__first_name", "owner__last_name"]
    autocomplete_fields = ["owner"]
    filter_horizontal = ["categories", "tags"]
    prepopulated_fields = {"slug": ("name",)}
    readonly_fields = [
        "id",
        "created_at",
        "updated_at",
        "formatted_price",
        "asset_count",
        "image_count",
    ]
    ordering = ["-created_at"]
    list_select_related = ["owner"]
    list_per_page = 25
    actions = ["mark_published", "mark_draft", "mark_archived", "mark_featured", "clear_featured"]
    inlines = [ProductImageInline, ProductAssetInline]

    fieldsets = (
        ("Product", {"fields": ("owner", "name", "slug", "description")}),
        ("Pricing", {"fields": ("price_cents", "formatted_price", "included")}),
        ("Taxonomy", {"fields": ("categories", "tags")}),
        ("Publishing", {"fields": ("status", "is_featured")}),
        (
            "Metadata",
            {
                "classes": ("collapse",),
                "fields": ("id", "asset_count", "image_count", "created_at", "updated_at"),
            },
        ),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).prefetch_related("categories", "tags")

    @admin.display(description="ID")
    def short_id(self, obj):
        return short_uuid(obj.id)

    @admin.display(description="Price", ordering="price_cents")
    def formatted_price(self, obj):
        return cents_to_dollars(obj.price_cents)

    @admin.display(description="Status", ordering="status")
    def status_label(self, obj):
        return status_badge(obj.status)

    @admin.display(description="Categories")
    def category_list(self, obj):
        return ", ".join(obj.categories.values_list("name", flat=True)[:3]) or "-"

    @admin.display(description="Tags")
    def tag_list(self, obj):
        return ", ".join(obj.tags.values_list("name", flat=True)[:3]) or "-"

    @admin.display(description="Assets")
    def asset_count(self, obj):
        if not obj:
            return "-"
        return obj.assets.count()

    @admin.display(description="Images")
    def image_count(self, obj):
        if not obj:
            return "-"
        return obj.images.count()

    @admin.action(description="Publish selected products")
    def mark_published(self, request, queryset):
        queryset.update(status="PUBLISHED")

    @admin.action(description="Move selected products to draft")
    def mark_draft(self, request, queryset):
        queryset.update(status="DRAFT")

    @admin.action(description="Archive selected products")
    def mark_archived(self, request, queryset):
        queryset.update(status="ARCHIVED")

    @admin.action(description="Feature selected products")
    def mark_featured(self, request, queryset):
        queryset.update(is_featured=True)

    @admin.action(description="Remove selected products from featured")
    def clear_featured(self, request, queryset):
        queryset.update(is_featured=False)


@admin.register(ProductImage)
class ProductImageAdmin(ModelAdmin):
    list_display = [
        "image_thumbnail",
        "short_id",
        "product",
        "image_link",
        "created_at",
    ]
    search_fields = ["product__name", "url"]
    autocomplete_fields = ["product"]
    readonly_fields = ["id", "image_thumbnail", "created_at"]
    list_select_related = ["product"]
    ordering = ["-created_at"]

    @admin.display(description="ID")
    def short_id(self, obj):
        return short_uuid(obj.id)

    @admin.display(description="URL")
    def image_link(self, obj):
        if not obj.url:
            return "-"
        return format_html('<a href="{}" target="_blank" rel="noopener">Open image</a>', obj.url)


@admin.register(ProductAsset)
class ProductAssetAdmin(ModelAdmin):
    list_display = [
        "short_id",
        "product",
        "filename",
        "asset_type",
        "mime_type",
        "formatted_file_size",
        "asset_link",
        "created_at",
    ]
    list_filter = ["asset_type", "mime_type", "created_at"]
    search_fields = ["product__name", "filename", "file_url", "mime_type"]
    autocomplete_fields = ["product"]
    readonly_fields = ["id", "created_at", "formatted_file_size", "asset_link"]
    list_select_related = ["product"]
    ordering = ["-created_at"]

    @admin.display(description="ID")
    def short_id(self, obj):
        return short_uuid(obj.id)

    @admin.display(description="Size", ordering="file_size")
    def formatted_file_size(self, obj):
        if not obj.file_size:
            return "-"
        if obj.file_size < 1024 * 1024:
            return f"{obj.file_size / 1024:,.1f} KB"
        return f"{obj.file_size / (1024 * 1024):,.1f} MB"

    @admin.display(description="File")
    def asset_link(self, obj):
        if not obj.file_url:
            return "-"
        return format_html('<a href="{}" target="_blank" rel="noopener">Open file</a>', obj.file_url)


@admin.register(ProductLicense)
class ProductLicenseAdmin(ModelAdmin):
    list_display = ["short_id", "product", "license_type", "formatted_price"]
    list_filter = ["license_type"]
    search_fields = ["product__name"]
    autocomplete_fields = ["product"]
    readonly_fields = ["id", "formatted_price"]
    ordering = ["product__name", "license_type"]

    @admin.display(description="ID")
    def short_id(self, obj):
        return short_uuid(obj.id)

    @admin.display(description="Price", ordering="price_cents")
    def formatted_price(self, obj):
        return cents_to_dollars(obj.price_cents)
