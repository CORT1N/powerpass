"""Password version schemas for the application."""
from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel


class PasswordVersionBase(BaseModel):
    """Base schema for password version data."""

    password_id: int
    encrypted_password: str
    modified_by: int | None = None


class PasswordVersionCreate(PasswordVersionBase):
    """Schema for creating a new password version."""

class PasswordVersionUpdate(BaseModel):
    """Schema for updating an existing password version."""

    encrypted_password: str | None = None
    modified_by: int | None = None
    modified_at: datetime | None = None


class PasswordVersionRead(BaseModel):
    """Schema for reading password version data."""

    id: int
    password_id: int
    encrypted_password: str
    modified_at: datetime
    modified_by: int | None = None

    class Config:
        """Configuration for Pydantic models."""

        orm_mode = True
