from django.contrib import admin
from ..orders.models import Order
from unfold.admin import ModelAdmin


# Register your models here.
@admin.register(Order)
class OrderAdmin(ModelAdmin):
    list_display = ["id", "user", "total_cents", "status", "created_at"]
