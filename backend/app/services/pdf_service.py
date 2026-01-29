from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.units import inch
from datetime import datetime
import io

class PDFService:
    def generate_ueh_certificate(self, data: dict) -> bytes:
        buffer = io.BytesIO()
        c = canvas.Canvas(buffer, pagesize=A4)
        width, height = A4

        # Encabezado
        c.setFont("Helvetica-Bold", 18)
        c.drawCentredString(width / 2, height - 1 * inch, "REPÚBLICA BOLIVARIANA DE VENEZUELA")
        c.setFont("Helvetica", 14)
        c.drawCentredString(width / 2, height - 1.3 * inch, "REGISTRO CIVIL")
        c.drawCentredString(width / 2, height - 1.6 * inch, "ACTA DE UNIÓN ESTABLE DE HECHO")

        # Fecha de emisión
        c.setFont("Helvetica-Oblique", 10)
        c.drawString(1 * inch, height - 2.5 * inch, f"Fecha de Emisión: {datetime.now().strftime('%d/%m/%Y')}")

        # Cuerpo del documento
        c.setFont("Helvetica", 12)
        text_y = height - 3.5 * inch
        line_height = 20

        content = [
            f"Por medio de la presente se certifica que:",
            "",
            f"El ciudadano(a): {data.get('nombre1', '')} {data.get('apellido1', '')}",
            f"Cédula de Identidad: {data.get('cedular1', 'N/A')}",
            "",
            "Y",
            "",
            f"El ciudadano(a): {data.get('nombre2', '')} {data.get('apellido2', '')}",
            f"Cédula de Identidad: {data.get('cedular2', 'N/A')}",
            "",
            f"Han registrado formalmente su UNIÓN ESTABLE DE HECHO bajo el Nro de Acta: {data.get('nacta', 'PENDIENTE')}",
            f"Ocurrido en Fecha: {data.get('fechaacta', datetime.now().strftime('%d/%m/%Y'))}",
            "",
            "Este documento tiene plena validez legal para fines administrativos y civiles."
        ]

        for line in content:
            c.drawCentredString(width / 2, text_y, line)
            text_y -= line_height

        # Pie de página
        c.setFont("Helvetica-Oblique", 8)
        c.drawCentredString(width / 2, 1 * inch, "Sistema Automatizado de Registro Civil - Generado por Bot CNE")

        c.save()
        buffer.seek(0)
        return buffer.getvalue()
