"""SharedPasswordLink CRUD operations for the application."""
from __future__ import annotations

import secrets
from datetime import datetime, timedelta, timezone
from zoneinfo import ZoneInfo

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from sqlalchemy.orm import Session

from app.models.shared_password_link import SharedPasswordLink


def generate_shared_link(
    db: Session,
    ciphertext: bytes,
    nonce: bytes,
    algo: str = "aes-256-gcm",
    created_by: int | None = None,
    expires_in_minutes: int | None = None,
    max_views: int | None = None,
) -> SharedPasswordLink:
    """Generate and save a new shared link for a password."""
    token = secrets.token_urlsafe(32)
    expires_at = (
        datetime.now(tz=ZoneInfo("Europe/Paris")) + timedelta(minutes=expires_in_minutes)
        if expires_in_minutes is not None
        else None
    )
    shared_link = SharedPasswordLink(
        token=token,
        ciphertext=ciphertext,
        nonce=nonce,
        algo=algo,
        created_by=created_by,
        created_at=datetime.now(timezone.utc),
        expires_at=expires_at,
        max_views=max_views,
        view_count=0,
    )
    db.add(shared_link)
    db.commit()
    db.refresh(shared_link)
    return shared_link

def get_shared_link_by_token(db: Session, token: str) -> SharedPasswordLink | None:
    """Retrieve a shared password link by its token."""
    return db.query(
        SharedPasswordLink,
        ).filter(SharedPasswordLink.token == token).first()

def increment_view_count(
    db: Session,
    shared_link: SharedPasswordLink,
    ) -> SharedPasswordLink:
    """Increment the view count for a shared password link."""
    shared_link.view_count += 1
    db.commit()
    db.refresh(shared_link)
    return shared_link
