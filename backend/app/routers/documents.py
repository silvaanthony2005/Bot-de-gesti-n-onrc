from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import Response
from app.services.pdf_service import PDFService
from pydantic import BaseModel
from app.models.civil_registry import Registrador, Acta, Unido, Testigo
from app.core.database import SessionLocal, engine, Base
from sqlalchemy import Column, Integer, String, DateTime, JSON
from datetime import datetime
import json

# Crear tabla simple para registros web si no existe
# Mantenemos SolicitudWeb por si acaso, pero ahora usaremos relaciones
class SolicitudWeb(Base):
    __tablename__ = "solicitudes_ueh_web"
    id = Column(Integer, primary_key=True, index=True)
    tipo = Column(String, default="UEH")
    datos = Column(JSON)
    created_at = Column(DateTime, default=datetime.now)

# Crear todas las tablas (incluyendo las nuevas de civil_registry)
Base.metadata.create_all(bind=engine)

router = APIRouter()
pdf_service = PDFService()

class CertificateData(BaseModel):
    # Meta / Ubicación
    nombrestado: str = "Táchira"
    nombremunicipio: str = "San Cristóbal"
    nombreparroquia: str = "La Concordia"
    charnacta: str = "WEB-000"
    folio: str = "001"
    dia1: str = str(datetime.now().day)
    mes1: str = str(datetime.now().month)
    ano1: str = str(datetime.now().year)
    tipoActa: str = "ACTA DE UNIÓN ESTABLE DE HECHO"

    # A. Registrador
    nombre1r: str = "Registrador"
    nombre2r: str = ""
    apellido1r: str = "Principal"
    apellido2r: str = ""
    cedula: str = "V-0000000"
    nombreuh: str = "Oficina Registro Civil"
    nresolucion: str = "000"
    fecharesolucion: str = "01/01/2024"
    ngacetamunicipal: str = "123"
    tipogaceta: str = "Extraordinaria"
    fechagacetamunicipal: str = "01/01/2024"

    # B. Unido
    nombre1Unido: str
    nombre2Unido: str = ""
    apellido1Unido: str
    apellido2Unido: str = ""
    fechaNacUnido: str = ""
    edadUnido: str = ""
    numDocumentoUnido: str
    tipoDocUnido: str = "V"
    etiquetaPais: str = "País"
    paisNacUnido: str = "Venezuela"
    etiquetaEstado: str = "Estado"
    estadoNacUnido: str = ""
    etiquetaMunicipio: str = "Mcpio"
    municipioNacUnido: str = ""
    etiquetaParroquia: str = "Parr"
    parroquiaNacUnido: str = ""
    nacionalidadUnido: str = "Venezolano"
    edoCivilUnido: str = "Soltero"
    profesionUnido: str = "Obrero"
    direccionUnido: str = ""

    # C. Unida
    nombre1Unida: str
    nombre2Unida: str = ""
    apellido1Unida: str
    apellido2Unida: str = ""
    fechaNacUnida: str = ""
    edadUnida: str = ""
    numDocumentoUnida: str
    tipoDocUnida: str = "V"
    etiquetaPais1: str = "País"
    paisNacUnida: str = "Venezuela"
    etiquetaEstado1: str = "Estado"
    estadoNacUnida: str = ""
    etiquetaMunicipio1: str = "Mcpio"
    municipioNacUnida: str = ""
    etiquetaParroquia1: str = "Parr"
    parroquiaNacUnida: str = ""
    nacionalidadUnida: str = "Venezolana"
    edoCivilUnida: str = "Soltera"
    profesionUnida: str = "Obrera"
    direccionUnida: str = ""

    # D. Manifestación y Hijos
    fechaManis: str = datetime.now().strftime("%d/%m/%Y")
    tablaHijos: str = "" # HTML string o texto

    # F. Testigos
    nombresTestigo1: str = "Testigo1"
    apellidosTestigo1: str = "Apellido1"
    tipoDocTestigo1: str = "V"
    docidentidadTestigo1: str = "000"
    edadTestigo1: str = "30"
    profesionTestigo1: str = "Testigo"
    nacionalidadTestigo1: str = "Venezolano"
    direccionTestigo1: str = ""

    nombresTestigo2: str = "Testigo2"
    apellidosTestigo2: str = "Apellido2"
    tipoDocTestigo2: str = "V"
    docidentidadTestigo2: str = "000"
    edadTestigo2: str = "30"
    profesionTestigo2: str = "Testigo"
    nacionalidadTestigo2: str = "Venezolano"
    direccionTestigo2: str = ""

@router.post("/generate-ueh")
async def generate_ueh_pdf(data: CertificateData):
    db = SessionLocal()
    try:
        # --- Lógica Relacional ---
        
        # 1. Buscar o Crear Registrador
        registrador = db.query(Registrador).filter(Registrador.cedula == data.cedula).first()
        if not registrador:
            registrador = Registrador(
                nombre1=data.nombre1r,
                nombre2=data.nombre2r,
                apellido1=data.apellido1r,
                apellido2=data.apellido2r,
                cedula=data.cedula,
                oficina=data.nombreuh,
                resolucion_nro=data.nresolucion,
                resolucion_fecha=data.fecharesolucion,
                gaceta_nro=data.ngacetamunicipal,
                gaceta_tipo=data.tipogaceta,
                gaceta_fecha=data.fechagacetamunicipal
            )
            db.add(registrador)
            db.commit()
            db.refresh(registrador)

        # 2. Crear Acta (Inicial)
        data.charnacta = f"WEB-{datetime.now().strftime('%M%S')}" # Temporal
        
        nueva_acta = Acta(
            numero_acta=data.charnacta, 
            folio=data.folio,
            fecha_acta=datetime(year=int(data.ano1), month=int(data.mes1), day=int(data.dia1)),
            fecha_manifestacion=data.fechaManis,
            estado=data.nombrestado,
            municipio=data.nombremunicipio,
            parroquia=data.nombreparroquia,
            registrador_id=registrador.id
        )
        db.add(nueva_acta)
        db.commit()
        db.refresh(nueva_acta)
        
        # 3. Datos de los Unidos
        # Unida/o 1
        unido1 = Unido(
            acta_id=nueva_acta.id,
            rol="DECLARANTE_1",
            nombre1=data.nombre1Unido,
            nombre2=data.nombre2Unido,
            apellido1=data.apellido1Unido,
            apellido2=data.apellido2Unido,
            cedula=data.numDocumentoUnido,
            tipo_documento=data.tipoDocUnido,
            fecha_nacimiento=data.fechaNacUnido,
            edad=data.edadUnido,
            nacionalidad=data.nacionalidadUnido,
            estado_civil=data.edoCivilUnido,
            profesion=data.profesionUnido,
            direccion=data.direccionUnido,
            pais_nac=data.paisNacUnido,
            estado_nac=data.estadoNacUnido,
            municipio_nac=data.municipioNacUnido
        )
        
        # Unida/o 2
        unido2 = Unido(
            acta_id=nueva_acta.id,
            rol="DECLARANTE_2",
            nombre1=data.nombre1Unida,
            nombre2=data.nombre2Unida,
            apellido1=data.apellido1Unida,
            apellido2=data.apellido2Unida,
            cedula=data.numDocumentoUnida,
            tipo_documento=data.tipoDocUnida,
            fecha_nacimiento=data.fechaNacUnida,
            edad=data.edadUnida,
            nacionalidad=data.nacionalidadUnida,
            estado_civil=data.edoCivilUnida,
            profesion=data.profesionUnida,
            direccion=data.direccionUnida,
            pais_nac=data.paisNacUnida, 
            estado_nac=data.estadoNacUnida,
            municipio_nac=data.municipioNacUnida
        )
        
        db.add(unido1)
        db.add(unido2)
        
        # 4. Testigos
        testigo1 = Testigo(
            acta_id=nueva_acta.id,
            numero_testigo=1,
            nombres=data.nombresTestigo1,
            apellidos=data.apellidosTestigo1,
            cedula=data.docidentidadTestigo1,
            tipo_documento=data.tipoDocTestigo1,
            edad=data.edadTestigo1,
            nacionalidad=data.nacionalidadTestigo1,
            profesion=data.profesionTestigo1,
            direccion=data.direccionTestigo1
        )
        
        testigo2 = Testigo(
            acta_id=nueva_acta.id,
            numero_testigo=2,
            nombres=data.nombresTestigo2,
            apellidos=data.apellidosTestigo2,
            cedula=data.docidentidadTestigo2,
            tipo_documento=data.tipoDocTestigo2,
            edad=data.edadTestigo2,
            nacionalidad=data.nacionalidadTestigo2,
            profesion=data.profesionTestigo2,
            direccion=data.direccionTestigo2
        )
        
        db.add(testigo1)
        db.add(testigo2)
        db.commit()
        
        # 5. Actualizar Numero de Acta Final
        real_nacta = f"WEB-{nueva_acta.id}-{datetime.now().year}"
        nueva_acta.numero_acta = real_nacta
        db.add(nueva_acta)
        db.commit()
        
        # Actualizamos objeto data para el PDF
        data.charnacta = real_nacta

        # 6. Generar PDF
        pdf_bytes = pdf_service.generate_from_template(data.dict())
        
        return Response(content=pdf_bytes, media_type="application/pdf", headers={
            "Content-Disposition": f"attachment; filename=certificado_ueh_{nueva_acta.id}.pdf"
        })
    except Exception as e:
        print(f"Error: {e}")
        # Intentar rollback si es error de base de datos
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        db.close()
