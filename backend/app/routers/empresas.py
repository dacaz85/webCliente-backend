# app/routers/empresas.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, delete
from typing import List
from pydantic import BaseModel
from app.models import UserPermiso
import os

from app.models import Empresa
from app.utils.deps import get_db

router = APIRouter(prefix="/empresas", tags=["empresas"])

STORAGE_PATH = os.getenv("STORAGE_PATH", "R:\\")  # Ruta al NAS o unidad montada

class EmpresaResponse(BaseModel):
    id: int
    numero: str
    nombre: str
    carpeta_base: str
    activo: bool
    fecha_creacion: str

class EmpresaCreateUpdate(BaseModel):
    numero: str
    nombre: str
    activo: bool = True

# Obtener todas las empresas
@router.get("/all", response_model=List[EmpresaResponse])
async def get_empresas(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Empresa))
    empresas = result.scalars().all()
    return [
        EmpresaResponse(
            id=e.id,
            numero=e.numero,
            nombre=e.nombre,
            carpeta_base=e.carpeta_base,
            activo=bool(e.activo),
            fecha_creacion=str(e.fecha_creacion)
        ) for e in empresas
    ]

# Crear empresa
@router.post("/", response_model=EmpresaResponse)
async def create_empresa(data: EmpresaCreateUpdate, db: AsyncSession = Depends(get_db)):
    if len(data.numero) != 4 or not data.numero.isdigit():
        raise HTTPException(400, "El número de empresa debe tener 4 dígitos")
    carpeta_base = f"{data.numero} {data.nombre}"
    empresa = Empresa(numero=data.numero, nombre=data.nombre, activo=data.activo, carpeta_base=carpeta_base)
    db.add(empresa)
    await db.commit()
    await db.refresh(empresa)
    return EmpresaResponse(
        id=empresa.id,
        numero=empresa.numero,
        nombre=empresa.nombre,
        carpeta_base=empresa.carpeta_base,
        activo=bool(empresa.activo),
        fecha_creacion=str(empresa.fecha_creacion)
    )

# Actualizar empresa
@router.put("/{empresa_id}", response_model=EmpresaResponse)
async def update_empresa(empresa_id: int, data: EmpresaCreateUpdate, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Empresa).where(Empresa.id == empresa_id))
    empresa = result.scalar_one_or_none()
    if not empresa:
        raise HTTPException(404, "Empresa no encontrada")
    if len(data.numero) != 4 or not data.numero.isdigit():
        raise HTTPException(400, "El número de empresa debe tener 4 dígitos")
    empresa.numero = data.numero
    empresa.nombre = data.nombre
    empresa.activo = data.activo
    empresa.carpeta_base = f"{data.numero} {data.nombre}"
    db.add(empresa)
    await db.commit()
    await db.refresh(empresa)
    return EmpresaResponse(
        id=empresa.id,
        numero=empresa.numero,
        nombre=empresa.nombre,
        carpeta_base=empresa.carpeta_base,
        activo=bool(empresa.activo),
        fecha_creacion=str(empresa.fecha_creacion)
    )

# Borrar empresa
@router.delete("/{empresa_id}", response_model=dict)
async def delete_empresa(empresa_id: int, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Empresa).where(Empresa.id == empresa_id))
    empresa = result.scalar_one_or_none()
    if not empresa:
        raise HTTPException(404, "Empresa no encontrada")
    await db.execute(delete(Empresa).where(Empresa.id == empresa_id))
    await db.commit()
    return {"msg": f"Empresa {empresa.nombre} eliminada"}

# Verificar existencia de carpeta
@router.get("/check_folder")
async def check_folder(carpeta_base: str):
    folder_path = os.path.join(STORAGE_PATH, carpeta_base)
    exists = os.path.exists(folder_path)
    return {"carpeta_base": carpeta_base, "exists": exists}

# Obtener subcarpetas de una empresa
@router.get("/{empresa_id}/subcarpetas")
async def get_subcarpetas(empresa_id: int, user_id: int = None, db: AsyncSession = Depends(get_db)):
    import os
    result = await db.execute(select(Empresa).where(Empresa.id == empresa_id))
    empresa = result.scalar_one_or_none()
    if not empresa:
        raise HTTPException(404, "Empresa no encontrada")

    folder_path = os.path.join(STORAGE_PATH, empresa.carpeta_base)
    if not os.path.exists(folder_path):
        raise HTTPException(404, f"No existe la carpeta: {empresa.carpeta_base}")

    subcarpetas = [f for f in os.listdir(folder_path) if os.path.isdir(os.path.join(folder_path, f))]

    if user_id:
        res = await db.execute(
            select(UserPermiso).where(
                (UserPermiso.user_id == user_id) &
                (UserPermiso.empresa_id == empresa_id)
            )
        )
        permisos = res.scalars().all()
        subcarpetas = [
            {"name": s, "rol": next((p.rol for p in permisos if p.subcarpeta == s), "lector"), "checked": any(p.subcarpeta == s for p in permisos)}
            for s in subcarpetas
        ]
    else:
        subcarpetas = [{"name": s, "rol": "lector", "checked": False} for s in subcarpetas]

    return subcarpetas
