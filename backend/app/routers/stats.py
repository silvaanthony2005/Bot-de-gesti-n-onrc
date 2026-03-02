from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, inspect, text
from app.core.database import get_db
from app.models.appointment import Appointment
from datetime import datetime, timedelta

router = APIRouter()


@router.get("/insights")
async def get_stats_insights(
    db: Session = Depends(get_db),
    days: int = Query(default=30, ge=1, le=365),
    tipo_tramite: str | None = Query(default=None),
    tipo_acta: str | None = Query(default=None),
):
    """
    Retorna análisis resumido y filtrable en texto/datos clave para chat.
    """
    since_date = datetime.now().date() - timedelta(days=days)

    citas_query = db.query(Appointment).filter(Appointment.fecha >= since_date)
    if tipo_tramite:
        citas_query = citas_query.filter(func.lower(Appointment.tipo_tramite) == tipo_tramite.lower())

    total_citas_periodo = citas_query.count()
    citas_confirmadas = citas_query.filter(Appointment.confirmada == True).count()  # noqa: E712

    top_tramites_rows = (
        citas_query.with_entities(
            Appointment.tipo_tramite,
            func.count(Appointment.id).label("total")
        )
        .group_by(Appointment.tipo_tramite)
        .order_by(text("total DESC"))
        .limit(5)
        .all()
    )

    pico_citas_row = (
        citas_query.with_entities(Appointment.fecha, func.count(Appointment.id).label("total"))
        .group_by(Appointment.fecha)
        .order_by(text("total DESC"), Appointment.fecha.asc())
        .first()
    )

    total_actas_periodo = 0
    top_actas = []
    try:
        table_names = inspect(db.bind).get_table_names()

        if "actas" in table_names:
            params = {"desde": since_date}
            where = "WHERE DATE(fecha_acta) >= :desde"
            if tipo_acta:
                where += " AND LOWER(tipo_acta) = :tipo_acta"
                params["tipo_acta"] = tipo_acta.lower()

            total_actas_periodo += db.execute(
                text(f"SELECT COUNT(*) FROM actas {where}"),
                params
            ).scalar() or 0

            rows_tipo_acta = db.execute(
                text(
                    f"""
                    SELECT COALESCE(NULLIF(TRIM(tipo_acta), ''), 'SIN TIPO') AS tipo, COUNT(*) AS total
                    FROM actas
                    {where}
                    GROUP BY COALESCE(NULLIF(TRIM(tipo_acta), ''), 'SIN TIPO')
                    ORDER BY total DESC
                    LIMIT 5
                    """
                ),
                params
            ).mappings().all()
            top_actas.extend(rows_tipo_acta)

        if "actaueh" in table_names:
            params_ueh = {"desde": since_date}
            where_ueh = "WHERE DATE(fechaacta) >= :desde"
            if tipo_acta:
                where_ueh += " AND LOWER(tipoacta) = :tipo_acta"
                params_ueh["tipo_acta"] = tipo_acta.lower()

            total_actas_periodo += db.execute(
                text(f"SELECT COUNT(*) FROM actaueh {where_ueh}"),
                params_ueh
            ).scalar() or 0
    except Exception:
        total_actas_periodo = 0

    top_tramites = [
        {"name": row.tipo_tramite or "SIN TIPO", "value": int(row.total)}
        for row in top_tramites_rows
    ]

    summary_lines = [
        f"Periodo analizado: últimos {days} días.",
        f"Total de citas: {total_citas_periodo}",
        f"Citas confirmadas: {citas_confirmadas}",
        f"Total de actas: {total_actas_periodo}",
    ]

    if pico_citas_row:
        summary_lines.append(
            f"Día con más citas: {pico_citas_row.fecha} ({int(pico_citas_row.total)} citas)"
        )

    top_actas_serialized = []
    for row in top_actas:
        try:
            top_actas_serialized.append({"name": row["tipo"], "value": int(row["total"])})
        except Exception:
            pass

    return {
        "filters": {
            "days": days,
            "tipo_tramite": tipo_tramite,
            "tipo_acta": tipo_acta,
        },
        "metrics": {
            "total_citas": total_citas_periodo,
            "citas_confirmadas": citas_confirmadas,
            "total_actas": total_actas_periodo,
        },
        "top_tramites": top_tramites,
        "top_actas": top_actas_serialized,
        "summary_markdown": "\n".join([f"- {line}" for line in summary_lines]),
    }

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
