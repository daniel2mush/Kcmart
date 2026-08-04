import uuid
from sqlalchemy import String, ForeignKey, text, Integer
from sqlalchemy.orm import Mapped, mapped_column, relationship
from database.postgresql import Base


class Image(Base):
    __tablename__ = "image"

    id: Mapped[uuid.UUID] = mapped_column(
        primary_key=True,
        default=uuid.uuid4,
        server_default=text("gen_random_uuid()"),
    )
    # Each row stores ONE image URL
    url: Mapped[str] = mapped_column(String(2048), nullable=False)

    # Optional display order (crucial when products have many images!)
    position: Mapped[int] = mapped_column(Integer, default=0)

    # Foreign Key linking directly to Product
    product_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("product.id", ondelete="CASCADE"), index=True, nullable=False
    )
