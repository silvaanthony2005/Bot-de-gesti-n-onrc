from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, inspect, text
from app.core.database import get_db
from app.models.appointment import Appointment
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

    # 3. Datos de Actas (tendencia y distribución por tipo)
    total_actas = 0
    actas_tendencia_map = {}
    distribucion_actas_map = {}

    try:
        table_names = inspect(db.bind).get_table_names()

        if "actaueh" in table_names:
            total_actas += db.execute(text("SELECT COUNT(*) FROM actaueh")).scalar() or 0

            rows_tendencia_ueh = db.execute(
                text(
                    """
                    SELECT DATE(fechaacta) AS fecha, COUNT(*) AS total
                    FROM actaueh
                    WHERE DATE(fechaacta) >= :desde
                    GROUP BY DATE(fechaacta)
                    ORDER BY DATE(fechaacta)
                    """
                ),
                {"desde": seven_days_ago}
            ).mappings().all()

            for row in rows_tendencia_ueh:
                fecha_key = str(row["fecha"])
                actas_tendencia_map[fecha_key] = actas_tendencia_map.get(fecha_key, 0) + int(row["total"])

            rows_tipo_ueh = db.execute(
                text(
                    """
                    SELECT COALESCE(NULLIF(TRIM(tipoacta), ''), 'SIN TIPO') AS tipo, COUNT(*) AS total
                    FROM actaueh
                    GROUP BY COALESCE(NULLIF(TRIM(tipoacta), ''), 'SIN TIPO')
                    """
                )
            ).mappings().all()

            for row in rows_tipo_ueh:
                tipo = row["tipo"]
                distribucion_actas_map[tipo] = distribucion_actas_map.get(tipo, 0) + int(row["total"])

        if "actas" in table_names:
            total_actas += db.execute(text("SELECT COUNT(*) FROM actas")).scalar() or 0

            rows_tendencia_actas = db.execute(
                text(
                    """
                    SELECT DATE(fecha_acta) AS fecha, COUNT(*) AS total
                    FROM actas
                    WHERE DATE(fecha_acta) >= :desde
                    GROUP BY DATE(fecha_acta)
                    ORDER BY DATE(fecha_acta)
                    """
                ),
                {"desde": seven_days_ago}
            ).mappings().all()

            for row in rows_tendencia_actas:
                fecha_key = str(row["fecha"])
                actas_tendencia_map[fecha_key] = actas_tendencia_map.get(fecha_key, 0) + int(row["total"])

            rows_tipo_actas = db.execute(
                text(
                    """
                    SELECT COALESCE(NULLIF(TRIM(tipo_acta), ''), 'SIN TIPO') AS tipo, COUNT(*) AS total
                    FROM actas
                    GROUP BY COALESCE(NULLIF(TRIM(tipo_acta), ''), 'SIN TIPO')
                    """
                )
            ).mappings().all()

            for row in rows_tipo_actas:
                tipo = row["tipo"]
                distribucion_actas_map[tipo] = distribucion_actas_map.get(tipo, 0) + int(row["total"])
    except Exception:
        total_actas = 0
        actas_tendencia_map = {}
        distribucion_actas_map = {}

    actas_tendencia = [
        {"fecha": fecha, "total": total}
        for fecha, total in sorted(actas_tendencia_map.items(), key=lambda item: item[0])
    ]

    distribucion_actas = [
        {"name": tipo, "value": total}
        for tipo, total in sorted(distribucion_actas_map.items(), key=lambda item: item[1], reverse=True)
    ]

    total_citas = db.query(Appointment).count()

    return {
        "citas_tendencia": [
            {"fecha": str(c.fecha), "total": c.total} for c in citas_por_dia
        ],
        "distribucion_tramites": [
            {"name": t.tipo_tramite or "Otros", "value": t.total} for t in tramites_dist
        ],
        "actas_tendencia": actas_tendencia,
        "distribucion_actas": distribucion_actas,
        "overview": {
            "total_actas": total_actas,
            "total_citas": total_citas,
            "citas_hoy": db.query(Appointment).filter(Appointment.fecha == datetime.now().date()).count()
        }
    }
