from rest_framework import serializers


class ProductDTO(serializers.Serializer):
    id = serializers.UUIDField(required=False)
    user_id = serializers.UUIDField()
    name = serializers.CharField()
    price = serializers.FloatField()
    description = serializers.CharField()
    images = serializers.ListField(child=serializers.CharField())
    includes = serializers.ListField(child=serializers.CharField())
    tag = serializers.CharField()
    product_type = serializers.CharField()
