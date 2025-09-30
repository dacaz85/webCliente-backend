# app/utils/deps.py
from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.database import async_session
from app.models import User
from app.auth import verify_password

async def get_db() -> AsyncSession:
    """Devuelve la sesión de base de datos asíncrona."""
    async with async_session() as session:
        yield session

async def get_user_by_id(user_id: int, db: AsyncSession) -> User:
    """Carga un usuario por su ID."""
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalars().first()
    return user

async def get_current_active_user(user_id: int, db: AsyncSession = Depends(get_db)) -> User:
    """Verifica que el usuario existe y está activo."""
    user = await get_user_by_id(user_id, db)
    if not user or not user.activo:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User inactive")
    return user

async def get_current_admin(user_id: int, db: AsyncSession = Depends(get_db)) -> User:
    """Verifica que el usuario es admin."""
    user = await get_current_active_user(user_id, db)
    if user.rol != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin required")
    return user

async def authenticate_user(username: str, password: str, db: AsyncSession) -> User:
    """Verifica credenciales y devuelve el usuario."""
    result = await db.execute(select(User).where(User.username == username))
    user = result.scalars().first()
    if not user or not verify_password(password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    return user
