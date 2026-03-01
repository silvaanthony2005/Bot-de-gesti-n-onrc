from sqlalchemy import Column, Integer, String, Date, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from app.core.database import Base
from datetime import datetime

class Registrador(Base):
    __tablename__ = "registradores"

    id = Column(Integer, primary_key=True, index=True)
    nombre1 = Column(String, nullable=False)
    nombre2 = Column(String, nullable=True)
    apellido1 = Column(String, nullable=False)
    apellido2 = Column(String, nullable=True)
    cedula = Column(String, unique=True, index=True, nullable=False)
    oficina = Column(String)
    resolucion_nro = Column(String)
    resolucion_fecha = Column(String) # Guardamos como string o Date según preferencia, string es más flexible para "01/01/2024"
    gaceta_nro = Column(String)
    gaceta_tipo = Column(String)
    gaceta_fecha = Column(String)

    # Relación inversa
    actas = relationship("Acta", back_populates="registrador")


class Acta(Base):
    __tablename__ = "actas"

    id = Column(Integer, primary_key=True, index=True)
    numero_acta = Column(String, index=True)
    folio = Column(String)
    fecha_acta = Column(DateTime, default=datetime.now)
    fecha_manifestacion = Column(String)
    
    estado = Column(String)
    municipio = Column(String)
    parroquia = Column(String)

    # Claves foráneas
    registrador_id = Column(Integer, ForeignKey("registradores.id"))

    # Relaciones
    registrador = relationship("Registrador", back_populates="actas")
    unidos = relationship("Unido", back_populates="acta", cascade="all, delete-orphan")
    testigos = relationship("Testigo", back_populates="acta", cascade="all, delete-orphan")
    

class Unido(Base):
    __tablename__ = "unidos"

    id = Column(Integer, primary_key=True, index=True)
    acta_id = Column(Integer, ForeignKey("actas.id"))
    rol = Column(String) # "UNIDO" o "UNIDA" / "DECLARANTE_1"

    nombre1 = Column(String)
    nombre2 = Column(String)
    apellido1 = Column(String)
    apellido2 = Column(String)
    
    cedula = Column(String)
    tipo_documento = Column(String, default="V")
    
    fecha_nacimiento = Column(String)
    edad = Column(String)
    nacionalidad = Column(String)
    estado_civil = Column(String)
    profesion = Column(String)
    direccion = Column(String)
    
    # Lugar de nacimiento
    pais_nac = Column(String)
    estado_nac = Column(String)
    municipio_nac = Column(String)

    acta = relationship("Acta", back_populates="unidos")


class Testigo(Base):
    __tablename__ = "testigos"

    id = Column(Integer, primary_key=True, index=True)
    acta_id = Column(Integer, ForeignKey("actas.id"))
    numero_testigo = Column(Integer) # 1 o 2

    nombres = Column(String) # A veces vienen juntos
    apellidos = Column(String)
    
    cedula = Column(String)
    tipo_documento = Column(String, default="V")
    
    edad = Column(String)
    nacionalidad = Column(String)
    profesion = Column(String)
    direccion = Column(String)

    acta = relationship("Acta", back_populates="testigos")
