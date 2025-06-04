"""Password schemas for the application."""
from __future__ import annotations

from pydantic import BaseModel


class PasswordBase(BaseModel):
    """Base model for password schemas."""

    name: str
    username: str | None = None
    category: str | None = None

class PasswordCreate(PasswordBase):
    """Schema for creating a new password."""

    encrypted_password: str

class PasswordRead(PasswordBase):
    """Schema for reading password data."""

    id: int
    shared_link: str | None = None

class PasswordUpdate(BaseModel):
    """Schema for updating an existing password."""

    name: str | None = None
    username: str | None = None
    category: str | None = None
    encrypted_password: str | None = None

    class Config:
        """Configuration for Pydantic models."""

        orm_mode = True
