from fastapi import Depends, FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.auth import get_current_user
from app.core.config import get_settings
from app.core.database import init_db
from app.controllers import chat_controller

settings = get_settings()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="Backend API para Bot CNE conectado a agente n8n"
)

# Configuración CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_origin_regex=settings.BACKEND_CORS_ORIGIN_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Incluir Routers
from app.routers import auth, documents, appointments, stats
app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(
    documents.router,
    prefix="/api/documents",
    tags=["Documents"],
    dependencies=[Depends(get_current_user)],
)
app.include_router(
    appointments.router,
    prefix="/api/appointments",
    tags=["Citas"],
    dependencies=[Depends(get_current_user)],
)
app.include_router(
    stats.router,
    prefix="/api/stats",
    tags=["Estadísticas"],
    dependencies=[Depends(get_current_user)],
)
app.include_router(
    chat_controller.router,
    prefix="/api",
    tags=["Chat"],
    dependencies=[Depends(get_current_user)],
)


@app.on_event("startup")
async def on_startup() -> None:
    init_db()


@app.get("/")
async def root():
    return {"message": "Bot CNE Backend is running", "version": settings.VERSION}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
