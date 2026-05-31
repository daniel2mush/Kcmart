from django.http import HttpResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from api.payments.application.payment_service import PaymentService
from api.payments.infrastructure.stripe_gateway import StripeGateway
from api.purchases.application.purchase_service import PurchaseService


class StripeWebhookView(APIView):
    authentication_classes = []  # webhooks don't use user auth
    permission_classes = []

    def post(self, request):
        payload = request.body
        signature = request.headers.get("Stripe-Signature", "")

        gateway = StripeGateway()
        try:
            event_data = gateway.verify_webhook(payload, signature)
        except ValueError:
            return HttpResponse(status=400)

        if not event_data or event_data["status"] != "SUCCESS":
            return HttpResponse(status=200)  # acknowledge but ignore non-success

        # Confirm payment
        payment_service = PaymentService(gateway)
        payment = payment_service.confirm_payment(
            provider_reference=event_data["provider_reference"],
            payment_status=event_data["status"],
        )

        # Create purchases
        purchase_service = PurchaseService()
        purchase_service.create_purchases_from_order(payment.order_id)

        return HttpResponse(status=200)
