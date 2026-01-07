from pydantic import BaseModel, Field
from typing import Optional, List

class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, description="El mensaje enviado por el usuario")
    session_id: Optional[str] = Field(None, description="Identificador único de sesión para mantener el contexto")

class ChatResponse(BaseModel):
    response: str = Field(..., description="La respuesta generada por el agente de IA")
    source_documents: Optional[List[str]] = Field(default=[], description="Documentos fuente utilizados si los hay")
