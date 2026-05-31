# api/urls.py or orders/urls.py
from django.urls import path
from api.orders.presentation.checkout_view import CheckoutView
from api.orders.presentation.webhook_view import StripeWebhookView

urlpatterns = [
    path("api/checkout/", CheckoutView.as_view(), name="checkout"),
    path("api/webhooks/stripe/", StripeWebhookView.as_view(), name="stripe-webhook"),
]
