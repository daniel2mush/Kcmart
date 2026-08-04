import uuid
from sqlalchemy import String, ForeignKey, text, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database.postgresql import Base


class Asset(Base):
    __tablename__ = "asset"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    url: Mapped[str] = mapped_column(String(2048), nullable=False)
    product_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("product.id", ondelete="CASCADE"), index=True, nullable=False
    )
