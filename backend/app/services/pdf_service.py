from xhtml2pdf import pisa
from io import BytesIO
import os
from jinja2 import Template

class PDFService:
    def generate_from_template(self, data: dict) -> bytes:
        # Ruta al template
        template_path = os.path.join(os.path.dirname(__file__), '..', 'templates', 'acta_ueh.html')
        
        with open(template_path, 'r', encoding='utf-8') as f:
            html_content = f.read()

        # Renderizar HTML con Jinja2 (reemplazo de variables {{ variable }})
        template = Template(html_content)
        rendered_html = template.render(**data)

        # Convertir a PDF
        buffer = BytesIO()
        pisa_status = pisa.CreatePDF(
            src=rendered_html,
            dest=buffer
        )

        if pisa_status.err:
            raise Exception("Error generando PDF desde HTML")

        buffer.seek(0)
        return buffer.getvalue()

    # Mantenemos el antiguo por si acaso y para compatibilidad temporal
    def generate_ueh_certificate(self, data: dict) -> bytes:
        return self.generate_from_template(data)
