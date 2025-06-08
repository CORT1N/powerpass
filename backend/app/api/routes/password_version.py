"""Password Version API Routes."""

from typing import Annotated

from app.crud.password import get_password_by_id
from app.crud.password_version import get_version_by_id, get_versions_by_password
from app.database import get_db
from app.models.password_version import PasswordVersion
from app.models.user import User
from app.schemas.password_version import PasswordVersionRead
from app.security.auth import get_current_user
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

router = APIRouter(prefix="/password_versions", tags=["password_versions"])


@router.get("/password/{password_id}", response_model=list[PasswordVersionRead])
def read_password_versions(
    password_id: int,
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
) -> list[PasswordVersion]:
    """Retrieve all versions of a specific password for the authenticated user."""
    password = get_password_by_id(db, password_id)
    if not password or password.owner.id != user.id:
        raise HTTPException(status_code=404, detail="Password not found")

    return get_versions_by_password(db, password_id)


@router.get("/{version_id}", response_model=PasswordVersionRead)
def read_password_version(
    version_id: int,
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
) -> PasswordVersion:
    """Retrieve a specific password version by its ID for the authenticated user."""
    version = get_version_by_id(db, version_id)
    if not version:
        raise HTTPException(status_code=404, detail="Version not found")

    if version.password.owner.id != user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    return version
