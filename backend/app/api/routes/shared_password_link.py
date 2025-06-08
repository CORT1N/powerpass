"""Shared Password Link API routes."""
from typing import Annotated
from base64 import urlsafe_b64decode

from app.crud.shared_password_link import (
    generate_shared_link,
    get_shared_link_by_token,
    increment_view_count,
)
from app.database import get_db
from app.models.user import User
from app.schemas.shared_password_link import (
    SharedPasswordLinkCreate,
    SharedPasswordLinkRead,
)
from app.security.auth import get_current_user
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter(prefix="/shared-links", tags=["shared_links"])


@router.post("/", response_model=SharedPasswordLinkRead)
def create_shared_link(
    user: Annotated[User, Depends(get_current_user)],
    shared_link_in: SharedPasswordLinkCreate,
    db: Session = Depends(get_db),
) -> SharedPasswordLinkRead:
    """Generate a new shared password link for the current user."""
    shared_link = generate_shared_link(
        db,
        ciphertext=urlsafe_b64decode(shared_link_in.ciphertext),
        nonce=urlsafe_b64decode(shared_link_in.nonce),
        algo=shared_link_in.algo or "aes-256-gcm",
        created_by=user.id,
        expires_in_minutes=shared_link_in.expires_in_minutes,
        max_views=shared_link_in.max_views,
    )
    return SharedPasswordLinkRead.from_orm_with_encoded_fields(shared_link)


@router.get("/{token}", response_model=SharedPasswordLinkRead)
def read_shared_link(
    token: str,
    db: Session = Depends(get_db),
) -> SharedPasswordLinkRead:
    """Retrieve a shared password link by its token.

    Increments the view count if link is valid and not expired.
    """
    shared_link = get_shared_link_by_token(db, token)
    if not shared_link:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Shared link not found.")

    from datetime import datetime
    from zoneinfo import ZoneInfo
    now = datetime.now(tz=ZoneInfo("Europe/Paris"))

    if shared_link.expires_at and shared_link.expires_at < now:
        raise HTTPException(status_code=status.HTTP_410_GONE, detail="Shared link expired.")

    if shared_link.max_views is not None and shared_link.view_count >= shared_link.max_views:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Shared link view limit reached.")

    increment_view_count(db, shared_link)
    return SharedPasswordLinkRead.from_orm_with_encoded_fields(shared_link)