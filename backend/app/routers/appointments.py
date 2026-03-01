from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.core.database import get_db
from app.models.appointment import Appointment
from datetime import date
from pydantic import BaseModel, EmailStr

router = APIRouter()

class AppointmentRequest(BaseModel):
    fecha: date
    hora: str
    nombre: str
    email: EmailStr
    tipo_tramite: str

# Configuración de límites
DAILY_LIMIT = 50

@router.post("/book", response_model=dict)
async def book_appointment(req: AppointmentRequest, db: Session = Depends(get_db)):
    """
    Intenta agendar una cita.
    Verifica que no haya más de 50 citas para ese día.
    Agrega a Google Calendar y envía correo de confirmación (placeholder).
    """

    # 1. Verificar disponibilidad (Límite 50)
    count = db.query(Appointment).filter(Appointment.fecha == req.fecha).count()
    
    if count >= DAILY_LIMIT:
        raise HTTPException(
            status_code=400, 
            detail=f"Lo sentimos, ya se han agendado el limite de {DAILY_LIMIT} citas para el día {req.fecha}."
        )

    # 2. Crear la cita en BD
    nueva_cita = Appointment(
        fecha=req.fecha,
        hora=req.hora,
        solicitante_nombre=req.nombre,
        solicitante_email=req.email,
        tipo_tramite=req.tipo_tramite,
        confirmada=True  # Asumimos confirmada por ahora
    )
    
    db.add(nueva_cita)
    db.commit()
    db.refresh(nueva_cita)

    # 3. Integración con Google Calendar (Placeholder)
    event_link = await _add_to_google_calendar(nueva_cita)
    
    # 4. Enviar Correo (Placeholder)
    await _send_confirmation_email(nueva_cita)

    return {
        "message": "Cita agendada con éxito",
        "appointment_id": nueva_cita.id,
        "google_calendar_link": event_link
    }

@router.get("/availability/{fecha}")
async def check_availability(fecha: date, db: Session = Depends(get_db)):
    """
    Retorna cuántos cupos quedan para una fecha específica.
    """
    count = db.query(Appointment).filter(Appointment.fecha == fecha).count()
    remaining = max(0, DAILY_LIMIT - count)
    return {
        "fecha": fecha,
        "booked": count,
        "remaining": remaining,
        "available": remaining > 0
    }

# --- Service Functions ---
from google.oauth2 import service_account
from googleapiclient.discovery import build
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
from app.core.config import get_settings

settings = get_settings()

# Configuración de Email (solo si hay credenciales)
mail_conf = None
if settings.has_mail_credentials:
    mail_conf = ConnectionConfig(
        MAIL_USERNAME=settings.MAIL_USERNAME,
        MAIL_PASSWORD=settings.MAIL_PASSWORD,
        MAIL_FROM=settings.MAIL_FROM or settings.MAIL_USERNAME,
        MAIL_PORT=settings.MAIL_PORT,
        MAIL_SERVER=settings.MAIL_SERVER,
        MAIL_STARTTLS=settings.MAIL_STARTTLS,
        MAIL_SSL_TLS=settings.MAIL_SSL_TLS,
        USE_CREDENTIALS=True,
        VALIDATE_CERTS=True
    )

async def _add_to_google_calendar(cita: Appointment):
    try:
        # Cargar credenciales desde archivo o entorno
        # Asumimos que service_account.json está en la raíz del backend o ruta especificada
        SCOPES = ['https://www.googleapis.com/auth/calendar']
        
        # Verificar si existe el archivo antes de intentar cargar
        import os
        if not os.path.exists(settings.GOOGLE_SERVICE_ACCOUNT_FILE):
             print(f"ADVERTENCIA: No se encontro el archivo {settings.GOOGLE_SERVICE_ACCOUNT_FILE}. Saltando Google Calendar.")
             return None

        creds = service_account.Credentials.from_service_account_file(
            settings.GOOGLE_SERVICE_ACCOUNT_FILE, scopes=SCOPES
        )

        service = build('calendar', 'v3', credentials=creds, cache_discovery=False)

        event = {
            'summary': f'Cita CNE: {cita.tipo_tramite} - {cita.solicitante_nombre}',
            'location': 'Registro Civil CNE (Oficina)',
            'description': f'Trámite de {cita.tipo_tramite}. Solicitante: {cita.solicitante_nombre}. Email: {cita.solicitante_email}',
            'start': {
                'dateTime': f'{cita.fecha}T{cita.hora}:00', 
                'timeZone': 'America/Caracas',
            },
            'end': {
                'dateTime': f'{cita.fecha}T{cita.hora}:30', 
                'timeZone': 'America/Caracas',
            },
            # Eliminamos attendees temporalmente para evitar error 403 en cuentas no-Workspace
            # 'attendees': [{'email': cita.solicitante_email}],
        }

        # DETERMINAR CALENDARIO DESTINO
        # Si GOOGLE_CALENDAR_ID está vacío, usará 'primary' (el del robot)
        calendar_id = settings.GOOGLE_CALENDAR_ID
        if not calendar_id:
             calendar_id = 'primary'
             print("ADVERTENCIA: Usando calendario 'primary' del robot. Es posible que no veas el evento en tu calendario personal.")
        else:
             print(f"Usando calendario configurado: {calendar_id}")

        # Ejecutamos la inserción (envolviéndola para no bloquear el servidor async)
        import asyncio
        loop = asyncio.get_event_loop()
        # insert() construye la request, execute() la envía
        request = service.events().insert(calendarId=calendar_id, body=event)
        event_result = await loop.run_in_executor(None, request.execute)
        
        cita.google_event_id = event_result.get('id')
        print(f"Evento creado ID: {cita.google_event_id}")
        
        return event_result.get('htmlLink')
    except Exception as e:
        print(f"Error Google Calendar: {str(e)}")
        # No fallamos la petición entera, solo logueamos el error
        return None

async def _send_confirmation_email(cita: Appointment):
    # Verificamos si podemos enviar correos
    if not mail_conf or not settings.has_mail_credentials:
        print("ADVERTENCIA: Credenciales de correo no configuradas. Saltando envío.")
        return False

    message = MessageSchema(
        subject=f"Confirmación de Cita CNE - {cita.fecha}",
        recipients=[cita.solicitante_email],
        body=f"""
        <h3>Hola {cita.solicitante_nombre},</h3>
        <p>Tu cita para el trámite de <strong>{cita.tipo_tramite}</strong> ha sido confirmada.</p>
        <ul>
            <li><strong>Fecha:</strong> {cita.fecha}</li>
            <li><strong>Hora:</strong> {cita.hora}</li>
            <li><strong>Lugar:</strong> Registro Civil</li>
        </ul>
        <p>Por favor lleva tu Cédula de Identidad laminada y los requisitos correspondientes.</p>
        <p>Atentamente,<br>Bot CNE</p>
        """,
        subtype=MessageType.html
    )

    fm = FastMail(mail_conf)
    try:
        await fm.send_message(message)
        return True
    except Exception as e:
        print(f"Error enviando email: {str(e)}")
        return False
