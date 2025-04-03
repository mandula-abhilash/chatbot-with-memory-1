import axios from "axios";

const apiUrl = "http://localhost:8000/api";
const axiosInstance = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

export const processMessage = async (sessionId, message) => {
  try {
    const response = await axiosInstance.post("/chat", {
      session_id: sessionId,
      message: message,
    });
    return response.data.response;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.detail || "Error processing message");
    }
    throw error;
  }
};

export const saveSession = async (sessionId) => {
  try {
    const response = await axiosInstance.post("/chat/save", {
      session_id: sessionId,
    });
    return response.data.success;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.detail || "Error saving session");
    }
    throw error;
  }
};
