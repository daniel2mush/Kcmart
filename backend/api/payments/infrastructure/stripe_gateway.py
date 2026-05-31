import stripe
from django.conf import settings
from api.payments.domain.payment import Payment, PaymentStatus
from api.payments.application.payment_gateway import PaymentGateway


class StripeGateway(PaymentGateway):
    def __init__(self):
        stripe.api_key = settings.STRIPE_SECRET_KEY

    def initiate_payment(self, payment: Payment) -> Payment:
        intent = stripe.PaymentIntent.create(
            amount=payment.amount_cents,
            currency="usd",
            metadata={
                "order_id": str(payment.order_id),
                "user_id": str(payment.user_id),
            },
        )
        payment.provider_reference = intent.id
        payment.client_secret = intent.client_secret
        return payment

    def verify_webhook(self, payload: bytes, signature: str) -> dict:
        try:
            event = stripe.Webhook.construct_event(
                payload, signature, settings.STRIPE_WEBHOOK_SECRET
            )
        except stripe.error.SignatureVerificationError:
            raise ValueError("Invalid signature")

        if event.type == "payment_intent.succeeded":
            intent = event.data.object
            return {
                "provider_reference": intent.id,
                "status": PaymentStatus.SUCCESS.value,
                "amount_cents": intent.amount,
            }
        # handle other events (payment_intent.payment_failed)
        return None
