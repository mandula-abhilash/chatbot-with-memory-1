"use client";

import { useState, useRef, useEffect } from "react";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { chatService } from "@/services/chatService";

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [sessionId, setSessionId] = useState(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (message) => {
    setMessages((prev) => [...prev, { text: message, isUser: true }]);

    try {
      const data = await chatService.sendMessage(message, sessionId);

      if (!sessionId && data.session_id) {
        setSessionId(data.session_id);
      }

      setMessages((prev) => [...prev, { text: data.response, isUser: false }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        {
          text: "Sorry, there was an error processing your message.",
          isUser: false,
        },
      ]);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 shadow-sm backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/95 dark:border-gray-800">
        <div className="container flex h-16 max-w-4xl items-center justify-center mx-auto">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            AI Chat Assistant
          </h1>
        </div>
      </header>

      <main className="flex-1 container max-w-4xl mx-auto flex flex-col">
        <div className="flex flex-col h-[calc(100vh-8rem)]">
          <div className="flex-1 overflow-y-auto">
            <div className="min-h-full flex flex-col justify-end py-4 px-4">
              {messages.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center space-y-3">
                    <div className="text-4xl">👋</div>
                    <p className="text-lg text-gray-500 dark:text-gray-400">
                      Start a conversation with your AI assistant
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {messages.map((msg, index) => (
                    <ChatMessage
                      key={index}
                      message={msg.text}
                      isUser={msg.isUser}
                    />
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>
          </div>

          <div className="border-t bg-white p-4 dark:bg-gray-900 dark:border-gray-800">
            <div className="max-w-3xl mx-auto">
              <ChatInput onSendMessage={handleSendMessage} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Home;
