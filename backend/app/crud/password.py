"""Password CRUD operations for the application."""
from __future__ import annotations

from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from sqlalchemy.orm import Session

    from app.schemas.password import PasswordCreate, PasswordUpdate

from app.models.password import Password
from app.crud.password_version import create_password_version


def create_password(db: Session, user_id: int, data: PasswordCreate) -> Password:
    """Create a new password entry for a user in the database."""
    password = Password(
        user_id=user_id,
        name=data.name,
        encrypted_password=data.encrypted_password,
        category=data.category,
    )
    db.add(password)
    db.commit()
    db.refresh(password)
    create_password_version(
        db=db,
        password_id=password.id,
        encrypted_password=data.encrypted_password,
    )
    return password


def get_passwords_by_user(db: Session, user_id: int) -> list[Password]:
    """Retrieve all passwords for a specific user."""
    return db.query(Password).filter(Password.user_id == user_id).all()


def get_password_by_id(db: Session, password_id: int) -> Password | None:
    """Retrieve a password entry by its ID."""
    return db.query(Password).filter(Password.id == password_id).first()


def update_password(db: Session, password: Password, data: PasswordUpdate) -> Password:
    """Update an existing password entry."""
    for field, value in data.dict(exclude_unset=True).items():
        setattr(password, field, value)
    db.commit()
    db.refresh(password)
    create_password_version(
        db=db,
        password_id=password.id,
        encrypted_password=data.encrypted_password,
    )
    return password


def delete_password(db: Session, password: Password) -> None:
    """Delete a password entry from the database."""
    db.delete(password)
    db.commit()
