import { v4 as uuidv4 } from "uuid";
import { ChatService } from "../services/chat.js";

const chatService = new ChatService();

export const processMessage = async (req, res) => {
  try {
    const { message } = req.body;
    let { session_id } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    if (!session_id) {
      session_id = uuidv4();
    }

    const response = await chatService.processMessage(session_id, message);

    res.json({
      session_id,
      response,
    });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const saveSession = async (req, res) => {
  try {
    const { session_id } = req.body;

    if (!session_id) {
      return res.status(400).json({ error: "Session ID is required" });
    }

    await chatService.saveSession(session_id);

    res.json({
      success: true,
      message: "Chat session saved successfully",
    });
  } catch (error) {
    console.error("Save chat error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
