"""Authentication API routes."""
from typing import Annotated

from app.crud.user import create_user, get_user_by_email
from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserRead
from app.security.auth import authenticate_user, create_access_token, get_current_user
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/register", response_model=UserRead)
def register(
    user_create: UserCreate,
    db: Annotated[Session, Depends(get_db)]) -> User:
    """Register a new user."""
    existing_user = get_user_by_email(db, email=user_create.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email is already registered.",
        )
    return create_user(db, user_create)


@router.post("/login")
def login(
    user_create: UserCreate,
    db: Annotated[Session, Depends(get_db)]) -> dict[str, str]:
    """Authenticate user and return access token."""
    user = authenticate_user(db, email=user_create.email, password=user_create.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password.",
        )
    access_token = create_access_token(data={"sub": user.email})
    return {"access_token": access_token, "token_type": "bearer"}


@router.get("/me", response_model=UserRead)
def read_me(
    current_user: User = Depends(get_current_user)) -> User:
    """Get the current authenticated user."""
    return current_user
