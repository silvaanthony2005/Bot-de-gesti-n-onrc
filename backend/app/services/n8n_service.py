import httpx
from fastapi import HTTPException
from app.core.config import get_settings
from app.models.chat_model import ChatRequest, ChatResponse

settings = get_settings()

class N8nService:
    async def send_message(self, chat_request: ChatRequest) -> ChatResponse:
        """
        Envía el mensaje del usuario al webhook de n8n y retorna la respuesta procesada.
        """
        webhook_url = settings.N8N_WEBHOOK_URL
        
        payload = {
            "message": chat_request.message,
            "sessionId": chat_request.session_id
        }
        
        try:
            async with httpx.AsyncClient() as client:
                response = await client.post(webhook_url, json=payload, timeout=30.0)
                
                response.raise_for_status()
                
                # Asumimos que n8n devuelve un JSON con la propiedad 'output' o 'text'
                # Ajusta esto según cómo configures tu nodo 'Respond to Webhook' en n8n
                data = response.json()
                
                # Intentamos obtener la respuesta de varios campos comunes
                bot_response = data.get("output") or data.get("text") or data.get("response") or "Lo siento, no pude procesar la respuesta."
                
                return ChatResponse(
                    response=bot_response,
                    source_documents=data.get("sourceDocuments", [])
                )
                
        except httpx.HTTPStatusError as e:
            print(f"Error HTTP al conectar con n8n: {e}")
            raise HTTPException(status_code=e.response.status_code, detail="Error al comunicarse con el agente de IA")
        except httpx.RequestError as e:
            print(f"Error de conexión con n8n: {e}")
            raise HTTPException(status_code=503, detail="Servicio de IA no disponible temporalmente")
        except Exception as e:
            print(f"Error inesperado: {e}")
            raise HTTPException(status_code=500, detail="Error interno del servidor")
