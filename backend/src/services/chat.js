import { ChatOpenAI } from "langchain/chat_models/openai";
import { ConversationChain } from "langchain/chains";
import { BufferMemory } from "langchain/memory";
import { RedisChatMessageHistory } from "langchain/stores/message/redis";
import { redis } from "../config/redis.js";
import { pool } from "../config/database.js";
import dotenv from "dotenv";

dotenv.config();

const SESSION_TTL = 3600; // 1 hour

export class ChatService {
  constructor() {
    this.model = new ChatOpenAI({
      openAIApiKey: process.env.OPENAI_API_KEY,
      modelName: process.env.OPENAI_MODEL_NAME,
      temperature: 0.7,
    });
  }

  async createConversationChain(sessionId) {
    const history = new RedisChatMessageHistory({
      sessionId,
      sessionTTL: SESSION_TTL,
      client: redis,
      sessionSecretKey: process.env.REDIS_SESSION_SECRET_KEY,
    });

    const memory = new BufferMemory({
      chatHistory: history,
      returnMessages: true,
      memoryKey: "chat_history",
    });

    return new ConversationChain({
      llm: this.model,
      memory: memory,
    });
  }

  async processMessage(sessionId, message) {
    const chain = await this.createConversationChain(sessionId);
    const response = await chain.call({ input: message });
    return response.response;
  }

  async saveSession(sessionId) {
    const history = new RedisChatMessageHistory({
      sessionId,
      client: redis,
      sessionSecretKey: process.env.REDIS_SESSION_SECRET_KEY,
    });

    const messages = await history.getMessages();

    await pool.query(
      "INSERT INTO chat_sessions (session_id, messages) VALUES ($1, $2)",
      [sessionId, JSON.stringify(messages)]
    );

    await history.clear();

    return true;
  }
}
