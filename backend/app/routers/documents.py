from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import Response
from app.services.pdf_service import PDFService
from pydantic import BaseModel
from app.core.database import SessionLocal, engine, Base
from sqlalchemy import Column, Integer, String, DateTime, JSON
from datetime import datetime
import json

# Crear tabla simple para registros web si no existe
class SolicitudWeb(Base):
    __tablename__ = "solicitudes_ueh_web"
    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(String, default="UEH")
    datos = Column(JSON)
    created_at = Column(DateTime, default=datetime.now)

# Crear la tabla automáticamente (en prod usaríamos Alembic)
Base.metadata.create_all(bind=engine)

router = APIRouter()
pdf_service = PDFService()

class CertificateData(BaseModel):
    nombre1: str
    apellido1: str
    cedular1: str
    nombre2: str
    apellido2: str
    cedular2: str
    nacta: str = "PENDIENTE"
    fechaacta: str = None

@router.post("/generate-ueh")
async def generate_ueh_pdf(data: CertificateData):
    db = SessionLocal()
    try:
        # 1. Guardar en Base de Datos
        nueva_solicitud = SolicitudWeb(
            tipo="UEH",
            datos=data.dict()
        )
        db.add(nueva_solicitud)
        db.commit()
        db.refresh(nueva_solicitud)
        
        # Actualizar nacta con el ID generado para el PDF
        data_dict = data.dict()
        data_dict['nacta'] = f"WEB-{nueva_solicitud.id}-{datetime.now().year}"

        # 2. Generar PDF
        pdf_bytes = pdf_service.generate_ueh_certificate(data_dict)
        
        return Response(content=pdf_bytes, media_type="application/pdf", headers={
            "Content-Disposition": f"attachment; filename=certificado_ueh_{nueva_solicitud.id}.pdf"
        })
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
