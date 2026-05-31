from dataclasses import dataclass, field
from uuid import UUID, uuid4


@dataclass
class Purchase:
    user_id: UUID
    product_id: UUID
    order_id: UUID
    license_type: str
    id: UUID = field(default_factory=uuid4)
