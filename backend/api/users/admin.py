from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from api.admin_helpers import short_uuid
from unfold.admin import ModelAdmin

from .models import User


@admin.register(User)
class UserAdmin(BaseUserAdmin, ModelAdmin):
    list_display = [
        "short_id",
        "email",
        "full_name",
        "is_staff",
        "is_superuser",
        "is_active",
        "last_login",
        "date_joined",
    ]
    list_filter = ["is_staff", "is_superuser", "is_active", "date_joined", "last_login"]
    search_fields = ["email", "first_name", "last_name"]
    ordering = ["email"]
    readonly_fields = ["id", "last_login", "date_joined"]

    fieldsets = (
        (None, {"fields": ("email", "password")}),
        ("Personal info", {"fields": ("first_name", "last_name")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Important dates", {"classes": ("collapse",), "fields": ("id", "last_login", "date_joined")}),
    )
    add_fieldsets = (
        (
            None,
            {
                "classes": ("wide",),
                "fields": ("email", "first_name", "last_name", "password1", "password2", "is_staff", "is_superuser"),
            },
        ),
    )
    filter_horizontal = ["groups", "user_permissions"]

    @admin.display(description="ID")
    def short_id(self, obj):
        return short_uuid(obj.id)

    @admin.display(description="Name", ordering="first_name")
    def full_name(self, obj):
        return obj.get_full_name() or "-"
