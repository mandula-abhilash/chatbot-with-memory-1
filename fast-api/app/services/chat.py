from langchain_openai import ChatOpenAI
from langchain.chains import LLMChain
from langchain.prompts import ChatPromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain_community.memory import RedisChatMessageHistory
from uuid import uuid4
from ..core.config import settings
from ..core.database import get_db_connection
import json

SESSION_TTL = 3600  # 1 hour

class ChatService:
    def __init__(self):
        self.model = ChatOpenAI(
            api_key=settings.OPENAI_API_KEY,
            model_name=settings.OPENAI_MODEL_NAME,
            temperature=0.7
        )

    def create_conversation_chain(self, session_id: str):
        history = RedisChatMessageHistory(
            session_id=session_id,
            session_ttl=SESSION_TTL,
            url=f"redis://{settings.REDIS_USERNAME}:{settings.REDIS_PASSWORD}@{settings.REDIS_HOST}:{settings.REDIS_PORT}",
            key_prefix=settings.REDIS_SESSION_SECRET_KEY
        )

        memory = ConversationBufferMemory(
            chat_memory=history,
            return_messages=True,
            memory_key="chat_history"
        )

        prompt = ChatPromptTemplate.from_template("""
            The following is a friendly conversation between a human and an AI.
            
            Current conversation:
            {chat_history}
            Human: {input}
            AI:
        """)

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
        return session_id, response["text"]

    async def save_session(self, session_id: str) -> bool:
        history = RedisChatMessageHistory(
            session_id=session_id,
            url=f"redis://{settings.REDIS_USERNAME}:{settings.REDIS_PASSWORD}@{settings.REDIS_HOST}:{settings.REDIS_PORT}",
            key_prefix=settings.REDIS_SESSION_SECRET_KEY
        )

        messages = await history.get_messages()
        
        conn = get_db_connection()
        try:
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO chat_sessions (session_id, messages) VALUES (%s, %s)",
                    (session_id, json.dumps([msg.dict() for msg in messages]))
                )
                conn.commit()
            
            await history.clear()
            return True
        finally:
            conn.close()