import { v4 as uuidv4 } from "uuid";
import asyncHandler from "express-async-handler";
import {
  processMessage as processChatMessage,
  saveSession as saveChatSession,
} from "../services/chat.js";

export const processMessage = asyncHandler(async (req, res) => {
  const { message } = req.body;
  let { session_id } = req.body;

  if (!message) {
    res.status(400);
    throw new Error("Message is required");
  }

  if (!session_id) {
    session_id = uuidv4();
  }

  const response = await processChatMessage(session_id, message);

  res.json({
    session_id,
    response,
  });
});

export const saveSession = asyncHandler(async (req, res) => {
  const { session_id } = req.body;

  if (!session_id) {
    res.status(400);
    throw new Error("Session ID is required");
  }

  await saveChatSession(session_id);

  res.json({
    success: true,
    message: "Chat session saved successfully",
  });
});
