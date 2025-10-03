# app/routers/permisos_cliente.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from pydantic import BaseModel

from app.models import UserPermiso, Empresa
from app.utils.deps import get_db, get_current_active_user

router = APIRouter(prefix="/permisos", tags=["permisos_cliente"])

# --- SCHEMAS ---
class SubcarpetaPermiso(BaseModel):
    name: str
    rol: str

class EmpresaPermisos(BaseModel):
    empresa_id: int
    empresa_nombre: str
    empresa_numero: str
    carpeta_fisica: str
    subcarpetas: List[SubcarpetaPermiso]

# --- ROUTES ---
@router.get("/", response_model=List[EmpresaPermisos])
async def get_permisos_cliente(
    current_user: dict = Depends(get_current_active_user),
    db: AsyncSession = Depends(get_db)
):
    user_id = current_user.id

    # Obtener permisos del usuario
    result = await db.execute(
        select(UserPermiso, Empresa)
        .join(Empresa, UserPermiso.empresa_id == Empresa.id)
        .where(UserPermiso.user_id == user_id)
    )
    rows = result.all()

    # Agrupar por empresa
    empresas_map = {}
    for permiso, empresa in rows:
        if empresa.id not in empresas_map:
            numero_str = str(empresa.numero).zfill(4) if empresa.numero else "0000"
            carpeta_fisica = f"{numero_str} {empresa.nombre}"
            empresas_map[empresa.id] = {
                "empresa_id": empresa.id,
                "empresa_nombre": empresa.nombre,
                "empresa_numero": numero_str,
                "carpeta_fisica": carpeta_fisica,
                "subcarpetas": []
            }
        empresas_map[empresa.id]["subcarpetas"].append({
            "name": permiso.subcarpeta,
            "rol": permiso.rol
        })

    return list(empresas_map.values())
