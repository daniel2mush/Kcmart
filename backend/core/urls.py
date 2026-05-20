from django.contrib import admin
from django.urls import include, path

from api.users import urls as user_urls
from api.products import urls as product_urls

custom_patterns = [
    path("", include(user_urls), name="Users urls"),
    path("", include(product_urls), name="Products urls"),
]
urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/v1/", include(custom_patterns)),
]
