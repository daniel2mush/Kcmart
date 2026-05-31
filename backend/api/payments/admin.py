from django.contrib import admin

from api.admin_helpers import cents_to_dollars, short_uuid, status_badge
from unfold.admin import ModelAdmin

from .models import Payment


@admin.register(Payment)
class PaymentAdmin(ModelAdmin):
    list_display = [
        "short_id",
        "order",
        "provider",
        "provider_reference",
        "formatted_amount",
        "status_label",
        "retry_count",
        "created_at",
    ]
    list_filter = ["status", "provider", "created_at"]
    search_fields = ["id", "provider", "provider_reference", "order__id", "order__user__email"]
    autocomplete_fields = ["order"]
    readonly_fields = ["id", "created_at", "formatted_amount"]
    list_select_related = ["order", "order__user"]
    ordering = ["-created_at"]
    actions = ["mark_success", "mark_failed", "mark_refunded"]

    fieldsets = (
        ("Payment", {"fields": ("order", "provider", "provider_reference", "amount_cents", "formatted_amount")}),
        ("Status", {"fields": ("status", "failure_reason", "retry_count")}),
        ("Metadata", {"classes": ("collapse",), "fields": ("id", "created_at")}),
    )

    @admin.display(description="ID")
    def short_id(self, obj):
        return short_uuid(obj.id)

    @admin.display(description="Amount", ordering="amount_cents")
    def formatted_amount(self, obj):
        return cents_to_dollars(obj.amount_cents)

    @admin.display(description="Status", ordering="status")
    def status_label(self, obj):
        return status_badge(obj.status)

    @admin.action(description="Mark selected payments successful")
    def mark_success(self, request, queryset):
        queryset.update(status="SUCCESS")

    @admin.action(description="Mark selected payments failed")
    def mark_failed(self, request, queryset):
        queryset.update(status="FAILED")

    @admin.action(description="Mark selected payments refunded")
    def mark_refunded(self, request, queryset):
        queryset.update(status="REFUNDED")
