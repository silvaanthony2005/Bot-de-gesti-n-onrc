from fastapi import APIRouter, Depends, status
from app.models.chat_model import ChatRequest, ChatResponse
from app.services.n8n_service import N8nService

router = APIRouter()

def get_n8n_service():
    return N8nService()

@router.post("/chat", response_model=ChatResponse, status_code=status.HTTP_200_OK)
async def chat_endpoint(
    request: ChatRequest,
    service: N8nService = Depends(get_n8n_service)
):
    """
    Endpoint principal para interactuar con el Chatbot.
    Recibe un mensaje, lo envía al agente n8n y devuelve la respuesta generada.
    """
    response = await service.send_message(request)
    return response
