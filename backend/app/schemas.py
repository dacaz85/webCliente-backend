# app/schemas.py
from pydantic import BaseModel, EmailStr
from datetime import datetime

# --------------------------
# Usuarios / Clientes
# --------------------------
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr
    rol: str
    activo: bool
    fecha_creacion: datetime

    model_config = {"from_attributes": True}

# --------------------------
# Empresas
# --------------------------
class EmpresaBase(BaseModel):
    numero: str
    nombre: str
    carpeta_base: str

class EmpresaResponse(EmpresaBase):
    id: int
    activo: bool
    fecha_creacion: datetime

    model_config = {"from_attributes": True}
