# app/routers/subcarpetaviewer.py
from fastapi import APIRouter, Depends, HTTPException, Query
from fastapi.responses import FileResponse
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.utils.deps import get_db
from app.models import Empresa
import os
import mimetypes

router = APIRouter(prefix="/subcarpetaviewer", tags=["subcarpetaviewer"])

# Ruta al NAS o unidad montada
STORAGE_PATH = os.getenv("STORAGE_PATH", "R:\\")

@router.get("/")
async def list_files(
    empresa_id: int = Query(None, description="ID de la empresa"),
    empresa_nombre: str = Query(None, description="Nombre de la empresa"),
    subcarpeta: str = Query(..., description="Subcarpeta de la empresa"),
    db: AsyncSession = Depends(get_db)
):
    if not empresa_id and not empresa_nombre:
        raise HTTPException(400, "Debes indicar empresa_id o empresa_nombre")

    # Buscar empresa por ID o nombre
    if empresa_id:
        result = await db.execute(select(Empresa).where(Empresa.id == empresa_id))
    else:
        result = await db.execute(select(Empresa).where(Empresa.nombre == empresa_nombre))
    empresa = result.scalar_one_or_none()
    if not empresa:
        raise HTTPException(404, "Empresa no encontrada")

    # Construir ruta de la empresa
    empresa_path = os.path.join(STORAGE_PATH, empresa.carpeta_base)
    if not os.path.exists(empresa_path):
        raise HTTPException(404, f"No existe la carpeta de la empresa: {empresa.carpeta_base}")

    # Comprobar que la subcarpeta existe dentro de la empresa
    subcarpetas_disponibles = [
        f for f in os.listdir(empresa_path) if os.path.isdir(os.path.join(empresa_path, f))
    ]
    if subcarpeta not in subcarpetas_disponibles:
        raise HTTPException(
            404,
            f"Subcarpeta '{subcarpeta}' no encontrada. Subcarpetas disponibles: {subcarpetas_disponibles}"
        )

    folder_path = os.path.join(empresa_path, subcarpeta)

    # Listar archivos permitidos
    files = [
        {
            "name": f,
            "url": f"/planos/download/{empresa.id}/{subcarpeta}/{f}"
        }
        for f in os.listdir(folder_path)
        if os.path.isfile(os.path.join(folder_path, f)) and
           f.lower().endswith((".jpg", ".jpeg", ".png", ".pdf"))
    ]
    return files

@router.get("/download/{empresa_id}/{subcarpeta}/{filename}")
async def download_file(
    empresa_id: int,
    subcarpeta: str,
    filename: str,
    db: AsyncSession = Depends(get_db)
):
    # Buscar empresa
    result = await db.execute(select(Empresa).where(Empresa.id == empresa_id))
    empresa = result.scalar_one_or_none()
    if not empresa:
        raise HTTPException(404, "Empresa no encontrada")

    # Construir ruta del archivo y normalizar
    file_path = os.path.join(STORAGE_PATH, empresa.carpeta_base, subcarpeta, filename)
    file_path = os.path.normpath(file_path)

    # Validar que la ruta esté dentro del NAS
    base_path = os.path.join(STORAGE_PATH, empresa.carpeta_base)
    if not file_path.startswith(base_path):
        raise HTTPException(400, "Ruta de archivo inválida")

    # Verificar existencia del archivo
    if not os.path.exists(file_path) or not os.path.isfile(file_path):
        raise HTTPException(404, "Archivo no encontrado")

    # Determinar MIME type automáticamente
    mime_type, _ = mimetypes.guess_type(file_path)
    return FileResponse(file_path, filename=filename, media_type=mime_type)
