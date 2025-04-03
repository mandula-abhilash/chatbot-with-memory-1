"use client";

import { useState } from "react";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";

const Home = () => {
  const [messages, setMessages] = useState([]);

  const handleSendMessage = async (message) => {
    // Add user message immediately
    setMessages((prev) => [...prev, { text: message, isUser: true }]);

    try {
      const response = await fetch("http://localhost:5000/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      // Add AI response
      setMessages((prev) => [...prev, { text: data.response, isUser: false }]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Add error message
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
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <h1 className="text-xl font-bold">AI Chat Assistant</h1>
        </div>
      </header>

      <main className="flex-1 container flex flex-col gap-4">
        <div className="flex-1 space-y-4 p-4">
          {messages.length === 0 ? (
            <div className="flex h-[calc(100vh-10rem)] items-center justify-center text-muted-foreground">
              Start a conversation by typing a message below.
            </div>
          ) : (
            messages.map((msg, index) => (
              <ChatMessage key={index} message={msg.text} isUser={msg.isUser} />
            ))
          )}
        </div>

        <div className="sticky bottom-0 border-t bg-background p-4">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </main>
    </div>
  );
};

export default Home;
