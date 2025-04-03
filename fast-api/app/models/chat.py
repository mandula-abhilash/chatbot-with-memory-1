from pydantic import BaseModel
from typing import Optional
from uuid import UUID

class ChatMessage(BaseModel):
    message: str
    session_id: Optional[str] = None

class ChatResponse(BaseModel):
    session_id: str
    response: str

class SaveSession(BaseModel):
    session_id: str