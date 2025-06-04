"""Shared Password Link Model."""
from datetime import datetime

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class SharedPasswordLink(Base):
    """Model representing a shared password link in the application."""

    __tablename__ = "shared_password_links"

    id = Column(Integer, primary_key=True)
    token = Column(String, unique=True, nullable=False, index=True)

    password_id = Column(
        Integer,
        ForeignKey("passwords.id", ondelete="CASCADE"),
        nullable=False,
        )
    created_by = Column(
        Integer,
        ForeignKey("users.id", ondelete="SET NULL"),
        nullable=True,
        )

    created_at = Column(DateTime, default=datetime.now)
    expires_at = Column(DateTime, nullable=True)
    max_views = Column(Integer, nullable=True)
    view_count = Column(Integer, default=0)

    password = relationship("Password", back_populates="shared_links")
