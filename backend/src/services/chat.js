import { ChatOpenAI } from "@langchain/openai";
import { LLMChain } from "@langchain/core/chains";
import { ConversationPromptTemplate } from "@langchain/core/prompts";
import { BufferMemory } from "@langchain/community/memory/buffer";
import { RedisChatMessageHistory } from "@langchain/community/stores/message/redis";
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

    // Create a conversation prompt template
    const prompt = ConversationPromptTemplate.fromTemplate(`
      The following is a friendly conversation between a human and an AI.
      
      Current conversation:
      {chat_history}
      Human: {input}
      AI:
    `);

    // Create LLMChain instead of ConversationChain
    return new LLMChain({
      llm: this.model,
      prompt: prompt,
      memory: memory,
    });
  }

  async processMessage(sessionId, message) {
    const chain = await this.createConversationChain(sessionId);
    const response = await chain.call({ input: message });
    return response.text;
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
