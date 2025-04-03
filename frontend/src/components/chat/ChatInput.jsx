import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ChatInput = ({ onSendMessage }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 w-full">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type your message..."
        className="flex-1 min-w-0 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-base shadow-sm transition-colors placeholder:text-gray-500 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900 dark:border-gray-800 dark:bg-gray-900 dark:placeholder:text-gray-400 dark:focus:border-gray-500 dark:focus:ring-gray-500"
      />
      <Button
        type="submit"
        size="icon"
        className="h-[42px] w-[42px] shrink-0 rounded-lg bg-gray-900 text-white shadow-sm hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600"
      >
        <Send className="h-5 w-5" />
        <span className="sr-only">Send message</span>
      </Button>
    </form>
  );
};
