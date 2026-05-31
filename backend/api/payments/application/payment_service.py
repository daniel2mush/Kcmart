from uuid import UUID
from api.payments.domain.payment import Payment, PaymentStatus
from api.payments.infrastructure.payment_repository import PaymentRepository
from api.payments.application.payment_gateway import PaymentGateway


class PaymentService:

    def __init__(self, gateway: PaymentGateway, payment_repo: PaymentRepository = None):
        self.gateway = gateway
        self.payment_repo = payment_repo or PaymentRepository()

    def initiate_payment(
        self, order_id: UUID, user_id: UUID, amount_cents: int, provider: str
    ) -> Payment:
        payment = Payment(
            order_id=order_id,
            user_id=user_id,
            amount_cents=amount_cents,
            provider=provider,
        )
        payment = self.gateway.initiate_payment(payment)
        return self.payment_repo.create(payment)

    def confirm_payment(self, provider_reference: str, payment_status: str):
        """
        Mark payment as success/failed based on webhook.
        Returns the updated Payment domain.
        """
        payment = self.payment_repo.get_by_provider_reference(provider_reference)
        self.payment_repo.update_status(payment.id, payment_status)
        payment.status = payment_status
        return payment
