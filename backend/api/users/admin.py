from django.contrib import admin
from unfold.admin import ModelAdmin

# Register your models here.
from .models import User


@admin.register(User)
class UserAdmin(ModelAdmin):
    list_display = ["id", "first_name", "last_name", "email", "password"]
