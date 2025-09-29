# app/models.py
from sqlalchemy import Column, Integer, String, Enum, Text, TIMESTAMP, CHAR, SmallInteger, text
from app.database import Base
import enum

class RolEnum(enum.Enum):
    admin = "admin"
    cliente = "cliente"

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), nullable=False)
    email = Column(String(100), nullable=False)
    password_hash = Column(String(255), nullable=False)
    rol = Column(Enum(RolEnum), nullable=False)
    activo = Column(SmallInteger, default=0)
    fecha_creacion = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))
    ultimo_login = Column(TIMESTAMP, nullable=True)

class Empresa(Base):
    __tablename__ = "empresas"
    id = Column(Integer, primary_key=True)
    numero = Column(CHAR(10), nullable=False)
    nombre = Column(String(100), nullable=False)
    carpeta_base = Column(String(255), nullable=False)
    activo = Column(SmallInteger, default=1)
    fecha_creacion = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))

class Log(Base):
    __tablename__ = "logs"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer)
    empresa_id = Column(Integer)
    accion = Column(String(255))
    detalle = Column(Text)
    ip = Column(String(50))
    fecha = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))

class UserPermiso(Base):
    __tablename__ = "user_permisos"
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, nullable=False)
    empresa_id = Column(Integer, nullable=False)
    subcarpeta = Column(String(255), nullable=True)  # nombre de la subcarpeta
    rol = Column(Enum("lector", "editor"), default="lector")  # rol por subcarpeta
    fecha_asignacion = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))

class Plano(Base):
    __tablename__ = "planos"
    id = Column(Integer, primary_key=True, index=True)
    nombre = Column(String(100))
    descripcion = Column(String(255))
