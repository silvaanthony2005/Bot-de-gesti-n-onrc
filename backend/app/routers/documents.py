from fastapi import APIRouter, HTTPException, Depends
from fastapi.responses import Response
from app.services.pdf_service import PDFService
from pydantic import BaseModel
from app.models.civil_registry import Registrador, Acta, Unido, Testigo
from app.models.acta import ActaUEH
from app.core.database import SessionLocal, engine, Base
from sqlalchemy import Column, Integer, String, DateTime, JSON, text, inspect
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

try:
    existing_columns = [col["name"] for col in inspect(engine).get_columns("actas")]
    if "tipo_acta" not in existing_columns:
        with engine.begin() as conn:
            conn.execute(text("ALTER TABLE actas ADD COLUMN tipo_acta VARCHAR"))
except Exception as schema_err:
    print(f"Aviso de esquema (tipo_acta): {schema_err}")

router = APIRouter()
pdf_service = PDFService()

class CertificateData(BaseModel):
    # Meta / Ubicación
    nombrestado: str = "Táchira"
    nombremunicipio: str = "San Cristóbal"
    nombreparroquia: str = "La Concordia"
    charnacta: str = ""
    folio: str = ""
    dia1: str = str(datetime.now().day)
    mes1: str = str(datetime.now().month)
    ano1: str = str(datetime.now().year)
    tipoActa: str = ""

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
    tipoDocUnido: str = ""
    etiquetaPais: str = ""
    paisNacUnido: str = ""
    etiquetaEstado: str = ""
    estadoNacUnido: str = ""
    etiquetaMunicipio: str = ""
    municipioNacUnido: str = ""
    etiquetaParroquia: str = ""
    parroquiaNacUnido: str = ""
    nacionalidadUnido: str = ""
    esExtranjeroUnido: str = ""
    edoCivilUnido: str = ""
    profesionUnido: str = ""
    direccionUnido: str = ""

    # C. Unida
    nombre1Unida: str
    nombre2Unida: str = ""
    apellido1Unida: str
    apellido2Unida: str = ""
    fechaNacUnida: str = ""
    edadUnida: str = ""
    numDocumentoUnida: str
    tipoDocUnida: str = ""
    etiquetaPais1: str = ""
    paisNacUnida: str = ""
    etiquetaEstado1: str = ""
    estadoNacUnida: str = ""
    etiquetaMunicipio1: str = ""
    municipioNacUnida: str = ""
    etiquetaParroquia1: str = ""
    parroquiaNacUnida: str = ""
    nacionalidadUnida: str = ""
    esExtranjeroUnida: str = ""
    edoCivilUnida: str = ""
    profesionUnida: str = ""
    direccionUnida: str = ""

    # D. Manifestación y Hijos
    fechaManis: str = datetime.now().strftime("%d/%m/%Y")
    tablaHijos: str = "" # HTML string o texto

    # F. Testigos
    nombresTestigo1: str = ""
    apellidosTestigo1: str = ""
    tipoDocTestigo1: str = ""
    docidentidadTestigo1: str = ""
    edadTestigo1: str = ""
    profesionTestigo1: str = ""
    nacionalidadTestigo1: str = ""
    direccionTestigo1: str = ""

    nombresTestigo2: str = ""
    apellidosTestigo2: str = ""
    tipoDocTestigo2: str = ""
    docidentidadTestigo2: str = ""
    edadTestigo2: str = ""
    profesionTestigo2: str = ""
    nacionalidadTestigo2: str = ""
    direccionTestigo2: str = ""

@router.post("/generate-ueh")
async def generate_ueh_pdf(data: CertificateData):
    db = SessionLocal()
    try:
        # Asegurar compatibilidad de esquema en tiempo de ejecución
        columns = [col["name"] for col in inspect(db.bind).get_columns("actas")]
        if "tipo_acta" not in columns:
            db.execute(text("ALTER TABLE actas ADD COLUMN tipo_acta VARCHAR"))
            db.commit()

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

        # 2. Calcular secuencia de número de acta (1..256) y folio incremental
        last_numeric_acta = None
        recent_actas = db.query(Acta).order_by(Acta.id.desc()).limit(1000).all()
        for row in recent_actas:
            numero_val = (row.numero_acta or "").strip()
            folio_val = (row.folio or "").strip()
            if numero_val.isdigit() and folio_val.isdigit():
                last_numeric_acta = row
                break

        if last_numeric_acta:
            current_numero = int(last_numeric_acta.numero_acta)
            current_folio = int(last_numeric_acta.folio)
        else:
            current_numero = 0
            current_folio = int((data.folio or "1").strip()) if str(data.folio or "1").strip().isdigit() else 1

        if current_numero >= 256:
            next_numero = 1
            next_folio = current_folio + 1
        else:
            next_numero = current_numero + 1
            next_folio = current_folio

        data.charnacta = str(next_numero)
        data.folio = str(next_folio)
        
        nueva_acta = Acta(
            numero_acta=data.charnacta,
            tipo_acta=(data.tipoActa or "UNION ESTABLE").upper(),
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
        tipo_doc_unido = "P" if (data.tipoDocUnido or "").upper().startswith("P") else "V"
        tipo_doc_unida = "P" if (data.tipoDocUnida or "").upper().startswith("P") else "V"
        tipo_doc_testigo_1 = "P" if (data.tipoDocTestigo1 or "").upper().startswith("P") else "V"
        tipo_doc_testigo_2 = "P" if (data.tipoDocTestigo2 or "").upper().startswith("P") else "V"

        # Unida/o 1
        unido1 = Unido(
            acta_id=nueva_acta.id,
            rol="DECLARANTE_1",
            nombre1=data.nombre1Unido,
            nombre2=data.nombre2Unido,
            apellido1=data.apellido1Unido,
            apellido2=data.apellido2Unido,
            cedula=data.numDocumentoUnido,
            tipo_documento=tipo_doc_unido,
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
            tipo_documento=tipo_doc_unida,
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
            tipo_documento=tipo_doc_testigo_1,
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
            tipo_documento=tipo_doc_testigo_2,
            edad=data.edadTestigo2,
            nacionalidad=data.nacionalidadTestigo2,
            profesion=data.profesionTestigo2,
            direccion=data.direccionTestigo2
        )
        
        db.add(testigo1)
        db.add(testigo2)
        db.commit()
        
        # 5. Insertar registro genérico en actaueh
        audit_payload = {
            "tipoActa": data.tipoActa,
            "acta_id": nueva_acta.id,
            "numero_acta": data.charnacta,
            "folio": data.folio,
            "ubicacion": {
                "estado": data.nombrestado,
                "municipio": data.nombremunicipio,
                "parroquia": data.nombreparroquia,
            },
            "declarante_1": {
                "nombre": f"{data.nombre1Unido} {data.apellido1Unido}".strip(),
                "documento": data.numDocumentoUnido,
                "es_extranjero": data.esExtranjeroUnido,
                "nacionalidad": data.nacionalidadUnido,
            },
            "declarante_2": {
                "nombre": f"{data.nombre1Unida} {data.apellido1Unida}".strip(),
                "documento": data.numDocumentoUnida,
                "es_extranjero": data.esExtranjeroUnida,
                "nacionalidad": data.nacionalidadUnida,
            },
        }

        acta_multi = ActaUEH(
            nacta=int(data.charnacta),
            tomo=int(data.folio) if str(data.folio).isdigit() else None,
            ano=datetime.now().year,
            fechaacta=datetime.now(),
            tipoacta=(data.tipoActa or "UNION ESTABLE").upper(),
            solicitante_json=json.dumps(audit_payload, ensure_ascii=False)
        )
        db.add(acta_multi)
        db.commit()
        
        # Actualizamos objeto data para el PDF
        data.tipoActa = (data.tipoActa or "UNION ESTABLE").upper()
        data.tipoDocUnido = tipo_doc_unido
        data.tipoDocUnida = tipo_doc_unida
        data.tipoDocTestigo1 = tipo_doc_testigo_1
        data.tipoDocTestigo2 = tipo_doc_testigo_2

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

@router.post("/generate-acta")
async def generate_generic_acta_pdf(data: CertificateData):
    return await generate_ueh_pdf(data)
