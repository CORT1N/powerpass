"""User model for the application."""
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship

from app.database import Base


class User(Base):
    """User class representing a user in the application."""

    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)

    passwords = relationship(
        "Password",
        back_populates="owner",
        cascade="all, delete-orphan",
        )
