# app/routers/planos.py
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from typing import List
from pydantic import BaseModel

from app.models import Plano
from app.utils.deps import get_db

router = APIRouter(prefix="/planos", tags=["planos"])

class PlanoResponse(BaseModel):
    id: int
    nombre: str
    precio: float

@router.get("/", response_model=List[PlanoResponse])
async def get_planos(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Plano))
    planos = result.scalars().all()
    return planos
