from dataclasses import dataclass, field
from uuid import UUID, uuid4
from enum import Enum


class PaymentStatus(Enum):
    INITIATED = "INITIATED"
    SUCCESS = "SUCCESS"
    FAILED = "FAILED"
    REFUNDED = "REFUNDED"


@dataclass
class Payment:
    order_id: UUID
    user_id: UUID
    amount_cents: int
    provider: str  # "STRIPE" / "PAYPAL"
    id: UUID = field(default_factory=uuid4)

    status: str = PaymentStatus.INITIATED.value
    provider_reference: str = ""  # payment intent ID / PayPal order ID
    client_secret: str = ""  # for Stripe confirmation
    redirect_url: str = ""  # for PayPal redirect
