# 🧪 Guía de Pruebas y Casos de Uso - Bot CNE (Asistente de Registro Civil)

Este documento detalla los escenarios de prueba para validar todas las funcionalidades del asistente inteligente, desde trámites hasta integraciones.

---

## 1. Escenarios de Registro (Formularios Dinámicos)

### Caso: Registro de Unión Estable de Hecho (UEH)
*   **Prompt del Usuario:** "Quisiera registrar mi unión estable con mi pareja" o hacer clic en el botón **"Registro UEH"** del Dashboard.
*   **Respuesta Esperada:** El bot debe reconocer la intención y desplegar el formulario visual de Registro UEH.
*   **Texto del Bot:** "Claro, para iniciar el trámite de Unión Estable de Hecho, por favor completa los datos en el siguiente formulario."
*   **Acción de validación:** El formulario debe aparecer incrustado en el chat. Al llenarlo y enviarlo, debe generar el PDF de la constancia.

---

## 2. Escenarios de Citas (Google Calendar + Límites)

### Caso: Agendamiento de Cita (Flujo Feliz)
*   **Prompt del Usuario:** "Quiero agendar una cita para mañana a las 10:00 am" o clic en **"Agendar Cita"** del Dashboard.
*   **Respuesta Esperada:** Aparece el formulario de citas pre-llenado o solicitando los datos.
*   **Validación Técnica:**
    1.  Verificar que llegue el correo de confirmación a `silvaanthony2005@gmail.com`.
    2.  Verificar que el evento aparezca en el calendario de Google "Citas CNE".
    3.  El bot debe responder: "Cita confirmada con éxito...".

### Caso: Límite de Citas (50 por día)
*   **Prueba de Estrés:** Intentar agendar más de 50 citas para la misma fecha (vía Postman).
*   **Respuesta Esperada:** El sistema debe devolver un Error 400.
*   **Texto del Bot:** "Lo sentimos, ya se han agendado el límite de 50 citas para el día seleccionado."

---

## 3. Escenarios de Inteligencia y Consultas (RAG/Contexto)

### Caso: Requisitos de Trámites
*   **Prompt del Usuario:** "¿Qué necesito para presentar a un niño nacido hace 2 meses?"
*   **Respuesta Esperada:** El bot debe diferenciar entre presentación ordinaria (antes de 90 días) y extemporánea.
*   **Respuesta Clave:** "Para una presentación ordinaria (menor a 90 días), necesitas: Certificado de Nacimiento (EV-25), cédulas de los padres y testigos..."

### Caso: Consultas en Base de Datos (SQL Tools)
*   **Prompt del Usuario:** "¿Cuántas uniones estables se registraron hoy?"
*   **Respuesta Esperada:** El bot debe ejecutar una consulta SQL interna y dar un número exacto.
*   **Respuesta Clave:** "Según mis registros, el día de hoy se han procesado [X] registros de Unión Estable."

---

## 4. Escenarios de Análisis Estadístico (Gráficas)

### Caso: Visualización en Dashboard
*   **Acción:** Abrir el Dashboard.
*   **Respuesta Esperada:** Deben cargar los gráficos de Recharts.
*   **Validación de Datos:** El gráfico de líneas debe mostrar picos en los días donde se hicieron las pruebas de agendamiento.

---

## 5. Pruebas Técnicas (Postman/Curl)

### Endpoint de Citas
*   **URL:** `POST http://localhost:8000/api/appointments/book`
*   **JSON de Prueba:**
    ```json
    {
      "fecha": "2026-03-05",
      "hora": "09:00",
      "nombre": "Tester QA",
      "email": "silvaanthony2005@gmail.com",
      "tipo_tramite": "UEH"
    }
    ```

### Endpoint de Estadísticas
*   **URL:** `GET http://localhost:8000/api/stats/summary`
*   **Respuesta Esperada:** Un JSON con `citas_tendencia` y `distribucion_tramites`.

---

## 📂 Ubicación de Archivos de Configuración Clave:
-   **Backend Config:** [backend/app/core/config.py](../backend/app/core/config.py)
-   **Service Account:** [backend/service_account.json](../backend/service_account.json)
-   **Variables de Entorno:** [backend/.env](../backend/.env)
