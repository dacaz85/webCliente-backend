# app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import login, register, users, planos, empresas, user_permisos
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

# Startup event
@app.on_event("startup")
async def startup_event():
    await init_models()

# Routers
app.include_router(login.router)
app.include_router(register.router)
app.include_router(users.router)
app.include_router(planos.router)
app.include_router(empresas.router)
app.include_router(user_permisos.router)
