# app/routers/login.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from pydantic import BaseModel
from datetime import datetime

from app.models import User
from app.utils.deps import get_db
from app.auth import verify_password, create_access_token

router = APIRouter(prefix="/login", tags=["login"])

class LoginRequest(BaseModel):
    username: str
    password: str

class LoginResponse(BaseModel):
    access_token: str
    token_type: str
    rol: str
    id: int
    username: str
    empresa_id: int | None = None  # solo para clientes
    empresa_nombre: str | None = None

@router.post("/", response_model=LoginResponse)
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    # Buscar usuario
    stmt = select(User).where(User.username == data.username)
    result = await db.execute(stmt)
    user = result.scalar_one_or_none()

    # Validar contraseña
    if not user or not verify_password(data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Usuario o contraseña incorrecta")

    # Actualizar ultimo_login
    stmt_update = (
        update(User)
        .where(User.id == user.id)
        .values(ultimo_login=datetime.utcnow())
    )
    await db.execute(stmt_update)
    await db.commit()

    # Crear token
    token_data = {"user_id": user.id, "rol": user.rol.value}
    token = create_access_token(token_data)

    # Solo los clientes tienen empresa_id y empresa_nombre
    empresa_id = None
    empresa_nombre = None
    if user.rol.value == "cliente":
        # Aquí puedes cargar la empresa asociada si tu modelo lo permite
        # ejemplo:
        if hasattr(user, "empresa_id"):
            empresa_id = user.empresa_id
            empresa_nombre = getattr(user, "empresa_nombre", None)

    return {
        "access_token": token,
        "token_type": "bearer",
        "rol": user.rol.value,
        "id": user.id,
        "username": user.username,
        "empresa_id": empresa_id,
        "empresa_nombre": empresa_nombre,
    }
