from rest_framework import serializers
from api.products.models import ProductStatus


class ProductWriteSerializer(serializers.Serializer):
    name = serializers.CharField()
    slug = serializers.SlugField()
    description = serializers.CharField()

    price_cents = serializers.IntegerField()
    included = serializers.ListField(child=serializers.CharField())

    status = serializers.ChoiceField(
        choices=ProductStatus.choices, default=ProductStatus.DRAFT
    )
    is_featured = serializers.BooleanField(default=False)

    # These now accept raw tag/category IDs (still UUIDs)
    tags = serializers.ListField(child=serializers.UUIDField())
    categories = serializers.ListField(child=serializers.UUIDField())

    # 👇 CHANGED: accept image URLs (strings), not UUIDs
    images = serializers.ListField(child=serializers.URLField())

    # 👇 CHANGED: accept asset URLs (strings), not UUIDs
    assets = serializers.ListField(child=serializers.URLField())


class ProductReadSerializer(serializers.Serializer):
    id = serializers.UUIDField()
    owner_id = serializers.UUIDField()
    name = serializers.CharField()
    slug = serializers.CharField()
    description = serializers.CharField()
    price_cents = serializers.IntegerField()
    included = serializers.ListField(child=serializers.CharField())
    status = serializers.CharField()
    is_featured = serializers.BooleanField()
    tags = serializers.ListField(child=serializers.DictField())
    categories = serializers.ListField(child=serializers.DictField())
    images = serializers.ListField(child=serializers.DictField())
    assets = serializers.ListField(child=serializers.DictField())
