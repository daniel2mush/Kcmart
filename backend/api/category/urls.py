from django.urls import path
from .presentation.views import GetCategoriesViewSet

urlpatterns = [
    path("product/categories/", GetCategoriesViewSet.as_view(), name="categories"),
]
