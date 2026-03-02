from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, inspect, text
from app.core.database import get_db
from app.models.appointment import Appointment
from app.models.acta import ActaUEH
from datetime import datetime, timedelta

router = APIRouter()

@router.get("/summary")
async def get_stats_summary(db: Session = Depends(get_db)):
    """
    Retorna estadísticas generales para el Dashboard.
    """
    # 1. Total de Citas por día (últimos 7 días)
    seven_days_ago = datetime.now().date() - timedelta(days=7)
    citas_por_dia = db.query(
        Appointment.fecha, 
        func.count(Appointment.id).label("total")
    ).filter(Appointment.fecha >= seven_days_ago)\
     .group_by(Appointment.fecha)\
     .order_by(Appointment.fecha).all()

    # 2. Distribución por Tipo de Trámite
    tramites_dist = db.query(
        Appointment.tipo_tramite, 
        func.count(Appointment.id).label("total")
    ).group_by(Appointment.tipo_tramite).all()

    # 3. Datos de Actas (compatible con distintos esquemas)
    total_actas_ueh = 0
    try:
        table_names = inspect(db.bind).get_table_names()
        if "actaueh" in table_names:
            total_actas_ueh = db.query(ActaUEH).count()
        elif "actas" in table_names:
            total_actas_ueh = db.execute(text("SELECT COUNT(*) FROM actas")).scalar() or 0
    except Exception:
        total_actas_ueh = 0

    return {
        "citas_tendencia": [
            {"fecha": str(c.fecha), "total": c.total} for c in citas_por_dia
        ],
        "distribucion_tramites": [
            {"name": t.tipo_tramite or "Otros", "value": t.total} for t in tramites_dist
        ],
        "overview": {
            "total_actas": total_actas_ueh,
            "citas_hoy": db.query(Appointment).filter(Appointment.fecha == datetime.now().date()).count()
        }
    }
