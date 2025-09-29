# app/routers/user_permisos.py
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List, Optional
from pydantic import BaseModel

from app.models import UserPermiso, User, Empresa
from app.utils.deps import get_db

router = APIRouter(prefix="/user_permisos", tags=["user_permisos"])

# --- SCHEMAS ---
class SubcarpetaPermiso(BaseModel):
    name: str
    rol: str = "lector"

class UserPermisoResponse(BaseModel):
    id: int
    user_id: int
    username: str
    email: str
    empresa_id: int
    empresa_nombre: str
    subcarpeta: str
    rol: str
    fecha_asignacion: str

class UserPermisoCreateUpdate(BaseModel):
    user_id: int
    empresa_id: int
    subcarpetas: List[SubcarpetaPermiso]

class UserPermisoUpdateRole(BaseModel):
    rol: str

# --- ROUTES ---
@router.get("/", response_model=List[UserPermisoResponse])
async def get_permisos(
    user_id: Optional[int] = Query(None),
    empresa_id: Optional[int] = Query(None),
    search: Optional[str] = Query(None),
    db: AsyncSession = Depends(get_db)
):
    query = select(UserPermiso)
    if user_id:
        query = query.where(UserPermiso.user_id == user_id)
    if empresa_id:
        query = query.where(UserPermiso.empresa_id == empresa_id)

    result = await db.execute(query)
    permisos = result.scalars().all()

    # Cargar usuarios y empresas relacionados
    user_ids = {p.user_id for p in permisos}
    empresa_ids = {p.empresa_id for p in permisos}

    users_res = await db.execute(select(User).where(User.id.in_(user_ids)))
    users = {u.id: u for u in users_res.scalars().all()}

    empresas_res = await db.execute(select(Empresa).where(Empresa.id.in_(empresa_ids)))
    empresas = {e.id: e for e in empresas_res.scalars().all()}

    # Filtrado por search (usuario, email, empresa)
    if search:
        permisos = [
            p for p in permisos
            if search.lower() in (users.get(p.user_id).username.lower() if users.get(p.user_id) else "")
            or search.lower() in (users.get(p.user_id).email.lower() if users.get(p.user_id) else "")
            or search.lower() in (empresas.get(p.empresa_id).nombre.lower() if empresas.get(p.empresa_id) else "")
        ]

    return [
        UserPermisoResponse(
            id=p.id,
            user_id=p.user_id,
            username=users.get(p.user_id).username if users.get(p.user_id) else "",
            email=users.get(p.user_id).email if users.get(p.user_id) else "",
            empresa_id=p.empresa_id,
            empresa_nombre=empresas.get(p.empresa_id).nombre if empresas.get(p.empresa_id) else "",
            subcarpeta=p.subcarpeta,
            rol=p.rol,
            fecha_asignacion=str(p.fecha_asignacion)
        )
        for p in permisos
    ]

@router.post("/", response_model=List[UserPermisoResponse])
async def create_permiso(data: UserPermisoCreateUpdate, db: AsyncSession = Depends(get_db)):
    created = []

    # Borrar permisos existentes de este usuario/empresa
    existing = await db.execute(
        select(UserPermiso).where(
            (UserPermiso.user_id == data.user_id) &
            (UserPermiso.empresa_id == data.empresa_id)
        )
    )
    for p in existing.scalars().all():
        await db.delete(p)

    # Crear permisos por subcarpeta
    for s in data.subcarpetas:
        permiso = UserPermiso(
            user_id=data.user_id,
            empresa_id=data.empresa_id,
            subcarpeta=s.name,
            rol=s.rol
        )
        db.add(permiso)
        await db.flush()
        created.append(
            UserPermisoResponse(
                id=permiso.id,
                user_id=permiso.user_id,
                username="",  # frontend puede refrescar usuarios si quiere
                email="",
                empresa_id=permiso.empresa_id,
                empresa_nombre="",
                subcarpeta=permiso.subcarpeta,
                rol=permiso.rol,
                fecha_asignacion=str(permiso.fecha_asignacion)
            )
        )
    await db.commit()
    return created

@router.put("/{permiso_id}", response_model=UserPermisoResponse)
async def update_permiso(permiso_id: int, data: UserPermisoUpdateRole, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UserPermiso).where(UserPermiso.id == permiso_id))
    permiso = result.scalar_one_or_none()
    if not permiso:
        raise HTTPException(404, "Permiso no encontrado")

    permiso.rol = data.rol
    db.add(permiso)
    await db.commit()
    await db.refresh(permiso)

    # Obtener info de usuario/empresa
    user_res = await db.execute(select(User).where(User.id == permiso.user_id))
    user = user_res.scalar_one_or_none()
    empresa_res = await db.execute(select(Empresa).where(Empresa.id == permiso.empresa_id))
    empresa = empresa_res.scalar_one_or_none()

    return UserPermisoResponse(
        id=permiso.id,
        user_id=permiso.user_id,
        username=user.username if user else "",
        email=user.email if user else "",
        empresa_id=permiso.empresa_id,
        empresa_nombre=empresa.nombre if empresa else "",
        subcarpeta=permiso.subcarpeta,
        rol=permiso.rol,
        fecha_asignacion=str(permiso.fecha_asignacion)
    )

@router.delete("/{permiso_id}", response_model=dict)
async def delete_permiso(permiso_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(UserPermiso).where(UserPermiso.id == permiso_id))
    permiso = result.scalar_one_or_none()
    if not permiso:
        raise HTTPException(404, "Permiso no encontrado")
    await db.delete(permiso)
    await db.commit()
    return {"msg": "Permiso eliminado"}
