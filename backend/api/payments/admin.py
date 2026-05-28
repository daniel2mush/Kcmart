from django.contrib import admin
from ..payments.models import Payment
from unfold.admin import ModelAdmin

# Register your models here.


@admin.register(Payment)
class PaymentAdmin(ModelAdmin):
    list_display = [
        "id",
        "order",
        "provider",
        "provider_reference",
        "amount_cents",
        "status",
    ]
