from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from api.orders.application.order_service import OrderService
from api.payments.application.payment_service import PaymentService
from api.payments.infrastructure.stripe_gateway import StripeGateway
from .serializers import CheckoutSerializer


class CheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = CheckoutSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # 1. Create order
        order_service = OrderService()
        order = order_service.create_order(
            user_id=request.user.id,
            items_data=serializer.validated_data["items"],
        )

        # 2. Initiate payment (use Stripe for now; swap based on provider)
        gateway = StripeGateway()  # could be selected dynamically
        payment_service = PaymentService(gateway)
        payment = payment_service.initiate_payment(
            order_id=order.id,
            user_id=request.user.id,
            amount_cents=order.total_cents,
            provider="STRIPE",
        )

        return Response(
            {
                "order_id": str(order.id),
                "client_secret": payment.client_secret,  # Stripe
                # "redirect_url": payment.redirect_url,      # for PayPal
            },
            status=status.HTTP_201_CREATED,
        )
