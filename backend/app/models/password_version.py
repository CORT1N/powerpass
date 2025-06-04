"""Password version model for tracking changes to user passwords."""
from datetime import datetime
from zoneinfo import ZoneInfo

from sqlalchemy import Column, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class PasswordVersion(Base):
    """PasswordVersion class representing a version of a user's password.

    Represents a version saved in the application.
    """

    __tablename__ = "password_versions"

    id = Column(Integer, primary_key=True, index=True)
    password_id = Column(
        Integer,
        ForeignKey("passwords.id", ondelete="CASCADE"),
        nullable=False,
        )

    encrypted_password = Column(String, nullable=False)
    modified_at = Column(
        DateTime,
        default=lambda: datetime.now(tz=ZoneInfo("Europe/Paris")),
        )

    password = relationship("Password", back_populates="versions")
