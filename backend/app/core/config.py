from pydantic_settings import BaseSettings
from functools import lru_cache
from dotenv import load_dotenv
import os

# Forzamos la carga del .env (para sistemas Windows que a veces fallan)
basedir = os.path.abspath(os.path.dirname(__file__))
# Ruta a backend/.env
env_path = os.path.join(basedir, "..", "..", ".env")
load_dotenv(dotenv_path=env_path)

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

    # Email Configuration
    MAIL_USERNAME: str = ""
    MAIL_PASSWORD: str = ""
    MAIL_FROM: str | None = "noreply@cne.gob.ve"
    MAIL_PORT: int = 587
    MAIL_SERVER: str | None = "smtp.gmail.com"
    MAIL_STARTTLS: bool = True
    MAIL_SSL_TLS: bool = False
    
    # Google Calendar Configuration
    GOOGLE_CALENDAR_ID: str | None = "primary"
    GOOGLE_SERVICE_ACCOUNT_FILE: str | None = "service_account.json"

    # Validaciones personalizadas para ignorar errores de settings vacíos
    @property
    def has_mail_credentials(self) -> bool:
        return bool(self.MAIL_USERNAME and self.MAIL_PASSWORD)

    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore"  # Ignora variables extra en .env que no estén aquí definidas


@lru_cache()
def get_settings():
    return Settings()
