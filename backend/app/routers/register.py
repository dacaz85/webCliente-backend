from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text
from app.schemas import UserCreate, UserResponse
from app.utils.deps import get_db
from app.models import User, RolEnum
from app.auth import get_password_hash

router = APIRouter(prefix="/register", tags=["register"])

@router.post("/", response_model=UserResponse)
async def register(user: UserCreate, db: AsyncSession = Depends(get_db)):
    # Verificar si username o email ya existen
    result = await db.execute(
        text("SELECT * FROM users WHERE username=:username OR email=:email"),
        {"username": user.username, "email": user.email}
    )
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username o email ya registrado")

    # Crear el usuario (siempre rol cliente para frontend)
    new_user = User(
        username=user.username,
        email=user.email,
        password_hash=get_password_hash(user.password),
        rol=RolEnum.cliente,
        activo=0
    )

    db.add(new_user)
    await db.commit()
    await db.refresh(new_user)  # ahora fecha_creacion se rellena automáticamente

    return new_user
