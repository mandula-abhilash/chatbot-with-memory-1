import { User, Bot } from "lucide-react";

export const ChatMessage = ({ message, isUser }) => {
  return (
    <div
      className={`flex items-start gap-4 ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md border ${
          isUser ? "bg-primary text-primary-foreground" : "bg-muted"
        }`}
      >
        {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
      </div>
      <div
        className={`flex-1 space-y-2 overflow-hidden ${
          isUser ? "text-right" : ""
        }`}
      >
        <div
          className={`inline-block rounded-lg px-4 py-2 text-sm ${
            isUser ? "bg-primary text-primary-foreground" : "bg-muted"
          }`}
        >
          {message}
        </div>
      </div>
    </div>
  );
};
