from django.contrib import admin
from django.urls import include, path

from api.users import urls

custom_patterns = [path("", include(urls), name="Users urls")]
urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include(custom_patterns)),
]
