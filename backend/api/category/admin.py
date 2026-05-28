from ..category.models import Category
from django.contrib import admin
from unfold.admin import ModelAdmin


# Register your models here.
@admin.register(Category)
class CategoryAdmin(ModelAdmin):
    list_display = ["id", "name", "slug"]
