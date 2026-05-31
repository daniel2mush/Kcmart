from rest_framework import serializers


class CheckoutItemSerializer(serializers.Serializer):
    product_id = serializers.UUIDField()
    license_type = serializers.CharField(max_length=30)


class CheckoutSerializer(serializers.Serializer):
    items = serializers.ListField(child=CheckoutItemSerializer())
