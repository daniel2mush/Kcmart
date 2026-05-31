from api.purchases.models import Purchase
from api.purchases.domain.purchase import Purchase as PurchaseDomain
from api.purchases.mappers.purchase_mapper import PurchaseMapper


class PurchaseRepository:

    def create(self, purchase: PurchaseDomain) -> PurchaseDomain:
        model = PurchaseMapper.to_model(purchase)
        model.save()
        return PurchaseMapper.to_domain(model)

    def bulk_create(self, purchases: list[PurchaseDomain]) -> list[PurchaseDomain]:
        models = [PurchaseMapper.to_model(p) for p in purchases]
        Purchase.objects.bulk_create(models)
        # Return domains with new IDs (simplified: re-fetch)
        return purchases  # IDs are already set if we pre-assign
