# app/routers/users.py
import secrets
import string

from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from typing import List
from pydantic import BaseModel
import random, string

from app.schemas import UserResponse
from app.auth import get_password_hash
from app.models import User
from app.utils.deps import get_db

router = APIRouter(prefix="/users", tags=["users"])

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    rol: str
    activo: bool

class PasswordResetResponse(BaseModel):
    id: int
    username: str
    email: str
    temp_password: str

class RoleUpdateRequest(BaseModel):
    role: str

# Obtener todos los usuarios
@router.get("/all", response_model=List[UserResponse])
async def get_users_all(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User))
    users = result.scalars().all()
    response = [
        UserResponse(
            id=u.id,
            username=u.username,
            email=u.email,
            rol=u.rol.value if hasattr(u.rol, "value") else str(u.rol),
            activo=bool(u.activo)
        ) for u in users
    ]
    return response

# Validar usuario (poner activo=True)
@router.post("/{user_id}/validate", response_model=UserResponse)
async def validate_user(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    user.activo = 1
    db.add(user)
    await db.commit()
    await db.refresh(user)

    return UserResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        rol=user.rol.value if hasattr(user.rol, "value") else str(user.rol),
        activo=bool(user.activo)
    )

# Eliminar usuario
@router.delete("/{user_id}", response_model=dict)
async def delete_user(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    await db.execute(delete(User).where(User.id == user_id))
    await db.commit()

    return {"msg": f"Usuario {user.username} eliminado"}

# Reset password
@router.post("/{user_id}/reset-password", response_model=PasswordResetResponse)
async def reset_password(user_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    # generar una contraseña temporal (10 caracteres alfanuméricos)
    temp_password = ''.join(secrets.choice(string.ascii_letters + string.digits) for _ in range(10))
    user.hashed_password = get_password_hash(temp_password)

    db.add(user)
    await db.commit()
    await db.refresh(user)

    return PasswordResetResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        temp_password=temp_password  # se muestra solo al admin
    )

# Modificar rol de usuario
@router.post("/{user_id}/set-role", response_model=UserResponse)
async def set_role(user_id: int, data: RoleUpdateRequest, db: AsyncSession = Depends(get_db)):
    role = data.role
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        raise HTTPException(404, "Usuario no encontrado")
    if role not in ["admin", "cliente"]:
        raise HTTPException(400, "Rol no válido")
    user.rol = role
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return UserResponse(
        id=user.id,
        username=user.username,
        email=user.email,
        rol=user.rol,
        activo=user.activo
    )