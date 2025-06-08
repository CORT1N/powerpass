"""Shared Password Link Model."""
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String, LargeBinary
from sqlalchemy.orm import relationship

from app.database import Base


class SharedPasswordLink(Base):
    """Model representing a shared password link in the application."""

    __tablename__ = "shared_password_links"

    id = Column(Integer, primary_key=True)
    token = Column(String, unique=True, nullable=False, index=True)

    created_by = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        )

    created_at = Column(DateTime(timezone=True), default=datetime.now(tz=ZoneInfo("Europe/Paris")))
    expires_at = Column(DateTime(timezone=True), nullable=True)
    max_views = Column(Integer, nullable=True)
    view_count = Column(Integer, default=0)
    ciphertext = Column(LargeBinary, nullable=False)
    nonce = Column(LargeBinary, nullable=False)
    algo = Column(String, default="aes-256-gcm")