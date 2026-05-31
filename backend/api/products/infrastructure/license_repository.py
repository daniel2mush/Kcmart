from uuid import UUID
from api.products.models import ProductLicense


class ProductLicenseRepository:
    """Read-only repository for license pricing."""

    def get_price_cents(self, product_id: UUID, license_type: str) -> int:
        try:
            license_obj = ProductLicense.objects.get(
                product_id=product_id,
                license_type=license_type,
                is_active=True,
            )
            return license_obj.price_cents
        except ProductLicense.DoesNotExist:
            raise ValueError(
                f"No active license {license_type} for product {product_id}"
            )
