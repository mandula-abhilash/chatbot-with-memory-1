from fastapi import APIRouter, HTTPException
from ..models.chat import ChatMessage, ChatResponse, SaveSession
from ..services.chat import ChatService

router = APIRouter()
chat_service = ChatService()

@router.post("/chat", response_model=ChatResponse)
async def process_message(chat_message: ChatMessage):
    try:
        session_id, response = await chat_service.process_message(
            chat_message.session_id, 
            chat_message.message
        )
        return ChatResponse(session_id=session_id, response=response)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/chat/save")
async def save_session(save_session: SaveSession):
    try:
        success = await chat_service.save_session(save_session.session_id)
        return {"success": success, "message": "Chat session saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))