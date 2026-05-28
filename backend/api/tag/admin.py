from django.contrib import admin
from ..tag.models import Tag
from unfold.admin import ModelAdmin


# Register your models here.
@admin.register(Tag)
class TagAdmin(ModelAdmin):
    list_display = ["id", "name"]
