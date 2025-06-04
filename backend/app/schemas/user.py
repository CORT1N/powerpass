"""User schemas for the application."""
from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    """Base model for user schemas."""

    email: EmailStr

class UserCreate(UserBase):
    """Schema for creating a new user."""

    password: str

class UserRead(UserBase):
    """Schema for reading user data."""

    id: int

    class Config:
        """Configuration for Pydantic models."""

        orm_mode = True
