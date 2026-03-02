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

                if response.status_code == 200 and not (response.text or '').strip():
                    response = await client.post(webhook_url, json=payload, timeout=30.0)
                
                # LOGS DE DEPURACIÓN CRÍTICOS (Míralos en la terminal de uvicorn)
                print(f"--- DEBUG N8N ---")
                print(f"Status Code: {response.status_code}")
                print(f"Headers: {response.headers.get('Content-Type')}")
                print(f"Cuerpo: {response.text}")
                print(f"-----------------")

                # Si no es 200, lanzamos error detallado de lo que dijo n8n
                if response.status_code != 200:
                    raise HTTPException(
                        status_code=response.status_code, 
                        detail=f"n8n respondió con error {response.status_code}: {response.text[:100]}"
                    )

                # Intentamos parsear el JSON de forma segura
                try:
                    data = response.json()
                except Exception as e:
                    print(f"Fallo al parsear JSON: {e}")
                    fallback = response.text or "Error: n8n devolvió una respuesta vacía."
                    if not response.text and chat_request.message and any(
                        key in chat_request.message.lower() for key in ["cita", "agendar", "reservar", "turno"]
                    ):
                        fallback = "Vamos a agendar tu cita. Completa el formulario por favor. [FORMULARIO: AGENDAR_CITA]"
                    # Si n8n devolvía texto plano pero decía que era 200 OK
                    return ChatResponse(
                        response=fallback,
                        source_documents=[]
                    )

                # Intentamos obtener la respuesta de varios campos comunes
                bot_response = data.get("output") or data.get("text") or data.get("response") or "Lo siento, no pude procesar el formato de la respuesta de n8n."
                
                return ChatResponse(
                    response=bot_response,
                    source_documents=data.get("sourceDocuments", [])
                )

        except httpx.HTTPStatusError as e:
            print(f"Error HTTP al conectar con n8n: {e}")
            raise HTTPException(status_code=e.response.status_code, detail=f"Error al comunicarse con n8n: {e}")
        except httpx.RequestError as e:
            print(f"Error de conexión con n8n: {e}")
            raise HTTPException(status_code=503, detail="Servicio de n8n no disponible (revisa si el túnel/webhook está activo)")
        except Exception as e:
            print(f"Error inesperado en N8nService: {e}")
            # Si el error ya es una HTTPException, la relanzamos
            if isinstance(e, HTTPException):
                raise e
            raise HTTPException(status_code=500, detail=str(e))
