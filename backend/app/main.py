"""PowerPass Backend API Main Module."""
from collections.abc import AsyncGenerator
from contextlib import asynccontextmanager

from fastapi import FastAPI

from app.api.routes import auth, password, password_version, shared_password_link, user
from app.database import create_db_and_tables


@asynccontextmanager
async def lifespan(app: FastAPI) -> AsyncGenerator[None, None]:
    """Application lifespan event handler."""
    create_db_and_tables()
    yield
    # Cleanup resources here if needed

app = FastAPI(title="PowerPass Backend API", lifespan=lifespan)

app.include_router(auth.router)
app.include_router(password.router)
app.include_router(password_version.router)
app.include_router(shared_password_link.router)
app.include_router(user.router)
