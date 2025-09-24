# app/routers/users.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update, delete
from typing import List
from pydantic import BaseModel

from app.models import User
from app.utils.deps import get_db

router = APIRouter(prefix="/users", tags=["users"])

class UserResponse(BaseModel):
    id: int
    username: str
    email: str
    rol: str
    activo: bool

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
