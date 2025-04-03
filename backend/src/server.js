import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();
const port = process.env.EXPRESS_PORT || 5000;

// Enable CORS for all routes
app.use(
  cors({
    origin: process.env.FRONTEND_APP_URL, // Allow frontend origin
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use("/api", chatRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
