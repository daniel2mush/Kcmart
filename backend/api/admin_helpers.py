from django.contrib import admin
from django.utils.html import format_html


def cents_to_dollars(cents):
    if cents is None:
        return "-"
    return f"${cents / 100:,.2f}"


def short_uuid(value):
    if not value:
        return "-"
    return str(value)[:8]


def status_badge(value):
    if not value:
        return "-"

    colors = {
        "PUBLISHED": ("#dcfce7", "#166534"),
        "PAID": ("#dcfce7", "#166534"),
        "SUCCESS": ("#dcfce7", "#166534"),
        "DRAFT": ("#fef9c3", "#854d0e"),
        "PENDING": ("#fef9c3", "#854d0e"),
        "INITIATED": ("#fef9c3", "#854d0e"),
        "FAILED": ("#fee2e2", "#991b1b"),
        "CANCELLED": ("#fee2e2", "#991b1b"),
        "ARCHIVED": ("#f3f4f6", "#374151"),
        "REFUNDED": ("#dbeafe", "#1d4ed8"),
    }
    background, text = colors.get(value, ("#f3f4f6", "#374151"))

    return format_html(
        (
            '<span style="display:inline-flex;border-radius:6px;padding:2px 8px;'
            'font-size:12px;font-weight:600;background:{};color:{};">{}</span>'
        ),
        background,
        text,
        value.title(),
    )


class HasProductsFilter(admin.SimpleListFilter):
    title = "has products"
    parameter_name = "has_products"

    def lookups(self, request, model_admin):
        return (
            ("yes", "Yes"),
            ("no", "No"),
        )

    def queryset(self, request, queryset):
        if self.value() == "yes":
            return queryset.filter(products__isnull=False).distinct()
        if self.value() == "no":
            return queryset.filter(products__isnull=True)
        return queryset
