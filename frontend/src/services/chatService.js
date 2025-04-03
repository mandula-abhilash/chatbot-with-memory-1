import api from "@/lib/axios";

export const chatService = {
  sendMessage: async (message, sessionId = null) => {
    try {
      const { data } = await api.post("/chat", {
        message,
        session_id: sessionId,
      });
      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to send message"
      );
    }
  },

  saveSession: async (sessionId) => {
    try {
      const { data } = await api.post("/chat/save", { session_id: sessionId });
      return data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || "Failed to save session"
      );
    }
  },
};
