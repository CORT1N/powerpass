"""Configuration module for the application."""
import os

from dotenv import load_dotenv

load_dotenv()

class Config:
    """Configuration class for the application."""

    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://powerpass:powerpass@db:5432/powerpass")

    SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
