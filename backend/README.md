# Backend - Bot CNE (FastAPI + N8N)

API REST construida con **FastAPI** que sirve como puente entre el frontend y un agente de inteligencia artificial orquestado en **n8n**.

## Estructura (Patrón MVC)

- **`app/models`**: Esquemas de datos (Pydantic) para validar peticiones y respuestas.
- **`app/controllers`**: Rutas de la API (Endpoints) que reciben las peticiones HTTP.
- **`app/services`**: Lógica de negocio e integración con terceros (Cliente HTTP para n8n).
- **`app/core`**: Configuraciones globales y variables de entorno.

## Requisitos Previos

- Python 3.10+
- Un flujo de n8n activo con un nodo `Webhook` (Método POST).

## Instalación y Ejecución

1. **Crear entorno virtual** (Opcional pero recomendado):
   ```bash
   python -m venv venv
   .\venv\Scripts\activate   # Windows
   # source venv/bin/activate # Linux/Mac
   ```

2. **Instalar dependencias**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configurar entorno**:
   - Revisa el archivo `.env` y asegúrate de poner la URL correcta de tu Webhook de n8n en `N8N_WEBHOOK_URL`.

4. **Ejecutar servidor**:
   ```bash
   uvicorn app.main:app --reload
   ```
   El servidor iniciará en `http://localhost:8000`.

## Endpoints

- `GET /`: Health check.
- `POST /api/chat`: Envía un mensaje al bot.
  - Body: `{"message": "Hola bot", "session_id": "opcional"}`
  - Response: `{"response": "Hola humano", "source_documents": []}`

## Configuración de n8n

Para que esto funcione, tu flujo de n8n debe:
1. Empezar con un nodo **Webhook** (POST).
2. Procesar el `message` del body.
3. Terminar con un nodo **Respond to Webhook** que devuelva un JSON con un campo `output`, `text` o `response`.
