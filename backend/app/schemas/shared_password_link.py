"""Shared Password Link schemas for the application."""
from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel
from base64 import urlsafe_b64encode


from app.schemas.password import PasswordRead


class SharedPasswordLinkBase(BaseModel):
    """Base schema for shared password links."""

    expires_at: datetime | None = None
    max_views: int | None = None


class SharedPasswordLinkCreate(SharedPasswordLinkBase):
    """Schema for creating a shared password link."""

    ciphertext: bytes
    nonce: bytes
    algo: str | None = "aes-256-gcm"
    expires_in_minutes: int | None = None


class SharedPasswordLinkRead(BaseModel):
    """Schema for reading a shared password link."""

    id: int
    token: str
    ciphertext: str
    nonce: str
    created_by: int | None = None
    created_at: datetime
    expires_at: datetime | None = None
    max_views: int | None = None
    view_count: int

    @classmethod
    def from_orm_with_encoded_fields(cls: Type[T], obj: Any) -> T:
        return cls(
            id=obj.id,
            token=obj.token,
            ciphertext=urlsafe_b64encode(obj.ciphertext).decode(),
            nonce=urlsafe_b64encode(obj.nonce).decode(),
            algo=getattr(obj, "algo", "aes-256-gcm"),
            created_by=obj.created_by,
            created_at=obj.created_at,
            expires_at=obj.expires_at,
            max_views=obj.max_views,
            view_count=obj.view_count,
        )

    class Config:
        """Configuration for Pydantic models."""

        orm_mode = True