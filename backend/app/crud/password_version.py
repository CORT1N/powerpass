"""Password Version CRUD operations for the application."""
from __future__ import annotations

from datetime import datetime
from typing import TYPE_CHECKING
from zoneinfo import ZoneInfo

if TYPE_CHECKING:
    from sqlalchemy.orm import Session

from app.models.password_version import PasswordVersion


def create_password_version(
    db: Session,
    password_id: int,
    encrypted_password: str,
    modified_by: int | None = None,
) -> PasswordVersion:
    """Create a new password version entry."""
    version = PasswordVersion(
        password_id=password_id,
        encrypted_password=encrypted_password,
        modified_at=datetime.now(tz=ZoneInfo("Europe/Paris")),
        modified_by=modified_by,
    )
    db.add(version)
    db.commit()
    db.refresh(version)
    return version


def get_versions_by_password(db: Session, password_id: int) -> list[PasswordVersion]:
    """Retrieve all versions for a given password."""
    return db.query(
        PasswordVersion,
        ).filter(PasswordVersion.password_id == password_id).all()


def get_version_by_id(db: Session, version_id: int) -> PasswordVersion | None:
    """Retrieve a specific password version by its ID."""
    return db.query(
        PasswordVersion,
        ).filter(PasswordVersion.id == version_id).first()
