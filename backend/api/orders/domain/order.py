from dataclasses import dataclass, field
from typing import List
from uuid import UUID, uuid4
from .exceptions import OrderValidationError


@dataclass
class OrderItem:
    product_id: UUID
    license_type: str
    price_cents: int
    product_name: str = ""  # snapshot, can be set later
    id: UUID = field(default_factory=uuid4)

    def validate(self):
        if self.price_cents <= 0:
            raise OrderValidationError("Item price must be positive")


@dataclass
class Order:
    user_id: UUID
    items: List[OrderItem] = field(default_factory=list)

    status: str = "PENDING"
    total_cents: int = 0

    id: UUID = field(default_factory=uuid4)

    def calculate_total(self):
        self.total_cents = sum(item.price_cents for item in self.items)

    def validate(self):
        if not self.items:
            raise OrderValidationError("Order must have at least one item")
        for item in self.items:
            item.validate()
        self.calculate_total()
        if self.total_cents <= 0:
            raise OrderValidationError("Total must be positive")
