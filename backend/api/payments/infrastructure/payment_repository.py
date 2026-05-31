from uuid import UUID
from api.payments.domain.payment import Payment
from api.payments.mappers.payment_mapper import PaymentMapper
from api.payments.models import Payment as PaymentModel


class PaymentRepository:

    def create(self, payment: Payment) -> Payment:
        model = PaymentMapper.to_model(payment)
        model.save()
        return PaymentMapper.to_domain(model)

    def get_by_provider_reference(self, ref: str) -> Payment:
        model = PaymentModel.objects.get(provider_reference=ref)
        return PaymentMapper.to_domain(model)

    def update_status(self, payment_id: UUID, status: str) -> None:
        PaymentModel.objects.filter(pk=payment_id).update(status=status)
