import express from "express";
import dotenv from "dotenv";
import chatRoutes from "./routes/chatRoutes.js";

dotenv.config();

const app = express();
const port = process.env.EXPRESS_PORT || 5000;

app.use(express.json());
app.use("/api", chatRoutes);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
