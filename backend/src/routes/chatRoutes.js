import express from "express";
import { processMessage, saveSession } from "../controllers/chatController.js";

const router = express.Router();

router.post("/chat/save", saveSession);
router.post("/chat", processMessage);

export default router;
