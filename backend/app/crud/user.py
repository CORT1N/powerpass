"""User CRUD operations for the application."""
from __future__ import annotations

from typing import TYPE_CHECKING

from passlib.hash import bcrypt

if TYPE_CHECKING:
    from sqlalchemy.orm import Session

    from app.schemas.user import UserCreate

from app.models.user import User


def get_user_by_email(db: Session, email: str) -> User | None:
    """Retrieve a user by his email address."""
    return db.query(User).filter(User.email == email).first()

def get_user_by_id(db: Session, user_id: int) -> User | None:
    """Retrieve a user by his ID."""
    return db.query(User).filter(User.id == user_id).first()

def create_user(db: Session, user: UserCreate) -> User:
    """Create a new user in the database."""
    hashed_password = bcrypt.hash(user.password)
    db_user = User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
