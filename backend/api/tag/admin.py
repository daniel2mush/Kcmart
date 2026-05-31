from django.contrib import admin
from django.db.models import Count

from api.admin_helpers import HasProductsFilter, short_uuid
from unfold.admin import ModelAdmin

from .models import Tag


@admin.register(Tag)
class TagAdmin(ModelAdmin):
    list_display = ["short_id", "name", "product_count"]
    search_fields = ["name"]
    list_filter = [HasProductsFilter]
    readonly_fields = ["id", "product_count"]
    ordering = ["name"]

    fieldsets = (
        (None, {"fields": ("name",)}),
        ("Metadata", {"classes": ("collapse",), "fields": ("id", "product_count")}),
    )

    def get_queryset(self, request):
        return super().get_queryset(request).annotate(product_total=Count("products"))

    @admin.display(description="ID")
    def short_id(self, obj):
        return short_uuid(obj.id)

    @admin.display(description="Products", ordering="product_total")
    def product_count(self, obj):
        return getattr(obj, "product_total", obj.products.count())
