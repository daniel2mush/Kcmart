from django.urls import path

from .presentation.views import (
    CreateProductView,
    GetProductByIdView,
    GetAllUserProductsView,
    UpdateProductView,
    GetAllProductsView,
)

urlpatterns = [
    path("product/create/", CreateProductView.as_view(), name="create_product"),
    path(
        "products/user/",
        GetAllUserProductsView.as_view(),
        name="get_all_user_products",
    ),
    path("products", GetAllProductsView.as_view(), name="get_all_products"),
    path("product/<uuid:pk>", GetProductByIdView.as_view(), name="get_product_by_id"),
    path(
        "product/update/<uuid:pk>/", UpdateProductView.as_view(), name="update_product"
    ),
]
