from rest_framework import serializers

# class ProductSerializer(serializers.ModelSerializer):
#
#     class Meta:
#         model = ProductModel
#         fields = "__all__"
#         read_only_fields = ("id", "user_id")
#         # extra_kwargs = {
#         #     "images": {"required": True},
#         #     "includes": {"required": True},
#         #     "tag": {"required": True},
#         #     "type": {"required": True},
#         # }


class ProductSerializer(serializers.Serializer):
    id = serializers.UUIDField(required=False)
    user_id = serializers.UUIDField(required=False)
    name = serializers.CharField()
    price = serializers.FloatField()
    description = serializers.CharField()
    images = serializers.ListField(child=serializers.CharField())
    includes = serializers.ListField(child=serializers.CharField())
    tag = serializers.CharField()
    product_type = serializers.CharField()
