from abc import ABC, abstractmethod
from api.payments.domain.payment import Payment


class PaymentGateway(ABC):

    @abstractmethod
    def initiate_payment(self, payment: Payment) -> Payment:
        """
        Call the provider to create a payment intent / order.
        Updates payment.provider_reference and client_secret/redirect_url.
        Returns the payment object.
        """
        pass

    @abstractmethod
    def verify_webhook(self, payload: bytes, signature: str) -> Payment:
        """
        Parse webhook data and return the corresponding Payment domain.
        (Or return the provider_reference and status for further processing.)
        """
        pass
