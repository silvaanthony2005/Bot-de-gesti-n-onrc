from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    PROJECT_NAME: str = "Bot CNE Backend"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # N8N Configuration
    N8N_WEBHOOK_URL: str
    
    # Database Configuration
    DATABASE_URL: str | None = None

    # CORS Configuration
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://localhost:3000"]

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore"  # Ignora variables extra en .env que no estén aquí definidas


@lru_cache()
def get_settings():
    return Settings()
