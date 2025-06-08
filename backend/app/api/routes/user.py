"""User API routes."""
from typing import Annotated

from app.crud import user as crud_user
from app.database import get_db
from app.schemas.user import UserRead
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter(
    prefix="/users",
    tags=["users"],
)


@router.get("/{user_id}", response_model=UserRead)
def read_user(
    user_id: int,
    db: Annotated[Session, Depends(get_db)],
    ) -> crud_user.User:
    """Retrieve a user by ID."""
    user = crud_user.get_user_by_id(db, user_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )
    return user
