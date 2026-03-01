from sqlalchemy import Column, Integer, String, Date, DateTime, Boolean
from app.core.database import Base
from datetime import datetime

class Appointment(Base):
    __tablename__ = "citas"

    id = Column(Integer, primary_key=True, index=True)
    fecha = Column(Date, nullable=False, index=True)  # Día de la cita
    hora = Column(String, nullable=False)             # Hora inicio
    solicitante_email = Column(String, nullable=False)
    solicitante_nombre = Column(String, nullable=False)
    tipo_tramite = Column(String, nullable=True)      # UEH, Defunción, etc.
    creado_en = Column(DateTime, default=datetime.utcnow)
    google_event_id = Column(String, nullable=True)   # ID del evento en Google Calendar
    confirmada = Column(Boolean, default=False)
