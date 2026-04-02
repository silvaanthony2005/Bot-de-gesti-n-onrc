from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def init_db():
    # Solo creamos la tabla de usuarios para habilitar autenticación sin afectar otras tablas.
    from app.models.user import User

    User.__table__.create(bind=engine, checkfirst=True)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
