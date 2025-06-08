"""Password API routes."""
from typing import Annotated

from app.crud.password import (
    create_password,
    delete_password,
    get_password_by_id,
    get_passwords_by_user,
    update_password,
)
from app.database import get_db
from app.models.password import Password
from app.models.user import User
from app.schemas.password import PasswordCreate, PasswordRead, PasswordUpdate
from app.security.auth import get_current_user
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter(prefix="/passwords", tags=["passwords"])


@router.get("/", response_model=list[PasswordRead])
def read_passwords(
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
) -> list[Password]:
    """Retrieve all passwords for the current user."""
    return get_passwords_by_user(db, user.id)


@router.post("/", response_model=PasswordRead)
def create_new_password(
    db: Annotated[Session, Depends(get_db)],
    user: Annotated[User, Depends(get_current_user)],
    password: PasswordCreate,
) -> Password:
    """Create a new password entry for the current user."""
    return create_password(db, user.id, password)


@router.get("/{password_id}", response_model=PasswordRead)
def read_password(
    db: Annotated[Session, Depends(get_db)],
    password_id: int,
    user: Annotated[User, Depends(get_current_user)],
) -> Password:
    """Retrieve a specific password entry by its ID for the current user."""
    password = get_password_by_id(db, password_id)
    if not password or password.owner.id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Password not found",
            )
    return password


@router.put("/{password_id}", response_model=PasswordRead)
def update_existing_password(
    db: Annotated[Session, Depends(get_db)],
    password_id: int,
    password_update: PasswordUpdate,
    user: Annotated[User, Depends(get_current_user)],
) -> Password:
    """Update an existing password entry for the current user."""
    password = get_password_by_id(db, password_id)
    if not password or password.owner.id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Password not found",
            )
    return update_password(db, password, password_update)


@router.delete("/{password_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_password_entry(
    db: Annotated[Session, Depends(get_db)],
    password_id: int,
    user: Annotated[User, Depends(get_current_user)],
) -> None:
    """Delete a specific password entry by its ID for the current user."""
    password = get_password_by_id(db, password_id)
    if not password or password.owner.id != user.id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Password not found",
            )
    delete_password(db, password)
