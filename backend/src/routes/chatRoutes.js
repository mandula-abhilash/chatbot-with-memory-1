import express from "express";
import { processMessage, saveSession } from "../controllers/chatController.js";

const router = express.Router();

router.post("/chat", processMessage);
router.post("/chat/save", saveSession);

export default router;
