from django.contrib import admin
from ..purchases.models import Purchase
from unfold.admin import ModelAdmin


# Register your models here.
@admin.register(Purchase)
class PurchaseAdmin(ModelAdmin):
    list_display = ["id", "user", "order", "product", "license_type", "purchased_at"]
