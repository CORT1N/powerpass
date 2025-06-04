"""Shared Password Link schemas for the application."""
from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from datetime import datetime

from pydantic import BaseModel


class SharedPasswordLinkBase(BaseModel):
    """Base schema for shared password links."""

    password_id: int
    expires_at: datetime | None = None
    max_views: int | None = None


class SharedPasswordLinkCreate(SharedPasswordLinkBase):
    """Schema for creating a shared password link."""

    created_by: int | None = None
    expires_in_minutes: int | None = None


class SharedPasswordLinkRead(BaseModel):
    """Schema for reading a shared password link."""

    id: int
    token: str
    password_id: int
    created_by: int | None = None
    created_at: datetime
    expires_at: datetime | None = None
    max_views: int | None = None
    view_count: int

    class Config:
        """Configuration for Pydantic models."""

        orm_mode = True
