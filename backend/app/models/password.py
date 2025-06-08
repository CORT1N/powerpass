"""Password model for storing user passwords."""
from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class Password(Base):
    """Password class representing a user's password in the application."""

    __tablename__ = "passwords"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False,
        )
    name = Column(String, nullable=False)
    username = Column(String, nullable=True)
    encrypted_password = Column(String, nullable=False)
    category = Column(String, nullable=True)


    owner = relationship("User", back_populates="passwords")
    versions = relationship(
        "PasswordVersion",
        back_populates="password",
        cascade="all, delete-orphan",
        )
