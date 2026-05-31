from django.contrib import admin

from api.admin_helpers import short_uuid
from unfold.admin import ModelAdmin

from .models import Purchase


@admin.register(Purchase)
class PurchaseAdmin(ModelAdmin):
    list_display = ["short_id", "user", "product", "license_type", "order", "purchased_at"]
    list_filter = ["license_type", "purchased_at", "product__categories", "product__tags"]
    search_fields = [
        "id",
        "user__email",
        "user__first_name",
        "user__last_name",
        "product__name",
        "order__id",
    ]
    autocomplete_fields = ["user", "product", "order"]
    readonly_fields = ["id", "purchased_at"]
    list_select_related = ["user", "product", "order"]
    ordering = ["-purchased_at"]

    fieldsets = (
        ("Purchase", {"fields": ("user", "product", "order", "license_type")}),
        ("Metadata", {"classes": ("collapse",), "fields": ("id", "purchased_at")}),
    )

    @admin.display(description="ID")
    def short_id(self, obj):
        return short_uuid(obj.id)
