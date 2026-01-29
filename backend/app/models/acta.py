from sqlalchemy import Column, Integer, String, Boolean, Date, DateTime
from app.core.database import Base
from datetime import datetime

class ActaUEH(Base):
    __tablename__ = "actaueh"

    # Adaptado al esquema visto en n8n
    idactaueh = Column(Integer, primary_key=True, index=True)
    nacta = Column(Integer, nullable=True)
    tomo = Column(Integer, nullable=True)
    ano = Column(Integer, nullable=True)
    fechaacta = Column(DateTime, default=datetime.now)
    tipoacta = Column(String, default="UEH")
    
    # Datos de los declarantes (esto normalmente iría en unidosueh pero simplificamos para el prototipo)
    # Si la tabla real es estricta, podría fallar si intentamos guardar nombres aquí
    # Así que usaremos una tabla de logs si la tabla actaueh es muy compleja
    # O mejor, usamos SQL crudo para insertar solo lo necesario
    
    # Para este ejemplo, asumiremos que guardamos en una tabla de auditoría o staging
    # O intentaremos guardar en 'actaueh' asumiendo que el usuario tiene esas columnas
    
    # Nota: Si el esquema es complejo, es mejor usar Text/JSON o una tabla separada 'solicitudes_ueh'
    solicitante_json = Column(String, nullable=True)
