from dataclasses import dataclass
from uuid import UUID


@dataclass
class Tag:
    id: UUID
    name: str
