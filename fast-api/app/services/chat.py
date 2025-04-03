from langchain_openai import ChatOpenAI
from langchain.chains import LLMChain
from langchain.prompts import ChatPromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain_community.chat_message_histories import RedisChatMessageHistory
from uuid import uuid4
from ..core.config import settings
from ..core.database import get_db_connection
import json

class ChatService:
    def __init__(self):
        self.model = ChatOpenAI(
            api_key=settings.OPENAI_API_KEY,
            model_name=settings.OPENAI_MODEL_NAME,
            temperature=0.7
        )

    def create_conversation_chain(self, session_id: str):
        redis_url = f"redis://{settings.REDIS_USERNAME}:{settings.REDIS_PASSWORD}@{settings.REDIS_HOST}:{settings.REDIS_PORT}"
        history = RedisChatMessageHistory(
            session_id=session_id,
            url=redis_url,
            key_prefix=settings.REDIS_SESSION_SECRET_KEY
        )

        memory = ConversationBufferMemory(
            chat_memory=history,
            return_messages=True,
            memory_key="chat_history"
        )

        prompt = ChatPromptTemplate.from_template("""
            The following is a friendly conversation between a human and an AI assistant.
            The AI assistant provides direct responses without prefixing them with 'AI:'.
            
            Current conversation:
            {chat_history}
            Human: {input}
            Assistant:""")

        return LLMChain(
            llm=self.model,
            prompt=prompt,
            memory=memory
        )

    async def process_message(self, session_id: str, message: str) -> str:
        if not session_id:
            session_id = str(uuid4())
            
        chain = self.create_conversation_chain(session_id)
        response = await chain.ainvoke({"input": message})
        return session_id, response["text"].strip()

    async def save_session(self, session_id: str) -> bool:
        redis_url = f"redis://{settings.REDIS_USERNAME}:{settings.REDIS_PASSWORD}@{settings.REDIS_HOST}:{settings.REDIS_PORT}"
        history = RedisChatMessageHistory(
            session_id=session_id,
            url=redis_url,
            key_prefix=settings.REDIS_SESSION_SECRET_KEY
        )

        messages = history.messages
        
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO chat_sessions (session_id, messages) VALUES (%s, %s)",
                    (session_id, json.dumps([{
                        "type": msg.type,
                        "content": msg.content,
                        "additional_kwargs": msg.additional_kwargs
                    } for msg in messages]))
                )
                conn.commit()
            
            history.clear() 
            return True
        finally:
            conn.close()