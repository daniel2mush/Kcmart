from django.urls import path

from api.tag.presentation.views import TagViewSet

urlpatterns = [path("product/tags/", TagViewSet.as_view(), name="tags")]
