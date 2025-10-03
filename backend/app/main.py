# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import login, register, users, subcarpetaviewer, empresas, user_permisos, permisos_cliente
from app.database import init_models

app = FastAPI(title="WebCliente API")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Cambiar a dominios específicos en producción
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(login.router)
app.include_router(register.router)
app.include_router(users.router)
app.include_router(subcarpetaviewer.router)
app.include_router(empresas.router)
app.include_router(user_permisos.router)
app.include_router(permisos_cliente.router)
