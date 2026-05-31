from api.payments.domain.payment import Payment
from api.payments.models import Payment as PaymentModel


class PaymentMapper:

    @staticmethod
    def to_domain(model: PaymentModel) -> Payment:
        return Payment(
            id=model.id,
            order_id=model.order_id,
            user_id=model.user_id,
            amount_cents=model.amount_cents,
            provider=model.provider,
            status=model.status,
            provider_reference=model.provider_reference,
            client_secret="",  # not stored in model, re-fetched from gateway if needed
        )

    @staticmethod
    def to_model(payment: Payment) -> PaymentModel:
        return PaymentModel(
            id=payment.id,
            order_id=payment.order_id,
            user_id=payment.user_id,
            provider=payment.provider,
            provider_reference=payment.provider_reference,
            amount_cents=payment.amount_cents,
            status=payment.status,
        )
