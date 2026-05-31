from django.contrib import admin

from api.admin_helpers import cents_to_dollars, short_uuid, status_badge
from unfold.admin import ModelAdmin

from .models import Order


@admin.register(Order)
class OrderAdmin(ModelAdmin):
    list_display = ["short_id", "user", "formatted_total", "status_label", "payment_count", "created_at"]
    list_filter = ["status", "created_at"]
    search_fields = ["id", "user__email", "user__first_name", "user__last_name"]
    autocomplete_fields = ["user"]
    readonly_fields = ["id", "created_at", "formatted_total", "payment_count"]
    list_select_related = ["user"]
    ordering = ["-created_at"]
    actions = ["mark_paid", "mark_pending", "mark_failed", "mark_cancelled"]

    fieldsets = (
        ("Order", {"fields": ("user", "total_cents", "formatted_total", "status")}),
        ("Metadata", {"classes": ("collapse",), "fields": ("id", "payment_count", "created_at")}),
    )

    @admin.display(description="ID")
    def short_id(self, obj):
        return short_uuid(obj.id)

    @admin.display(description="Total", ordering="total_cents")
    def formatted_total(self, obj):
        return cents_to_dollars(obj.total_cents)

    @admin.display(description="Status", ordering="status")
    def status_label(self, obj):
        return status_badge(obj.status)

    @admin.display(description="Payments")
    def payment_count(self, obj):
        if not obj:
            return "-"
        return obj.payments.count()

    @admin.action(description="Mark selected orders as paid")
    def mark_paid(self, request, queryset):
        queryset.update(status="PAID")

    @admin.action(description="Mark selected orders as pending")
    def mark_pending(self, request, queryset):
        queryset.update(status="PENDING")

    @admin.action(description="Mark selected orders as failed")
    def mark_failed(self, request, queryset):
        queryset.update(status="FAILED")

    @admin.action(description="Cancel selected orders")
    def mark_cancelled(self, request, queryset):
        queryset.update(status="CANCELLED")
