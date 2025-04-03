import { User, Bot } from "lucide-react";

export const ChatMessage = ({ message, isUser }) => {
  return (
    <div className="max-w-3xl mx-auto">
      <div
        className={`group flex items-start gap-4 ${
          isUser ? "flex-row-reverse" : ""
        }`}
      >
        <div
          className={`flex h-9 w-9 shrink-0 select-none items-center justify-center rounded-full border shadow-sm ${
            isUser
              ? "bg-gray-900 text-white dark:bg-gray-700"
              : "bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
          }`}
        >
          {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </div>
        <div
          className={`flex-1 space-y-2 overflow-hidden ${
            isUser ? "text-right" : ""
          }`}
        >
          <div
            className={`inline-block max-w-[85%] rounded-2xl px-4 py-2.5 text-base shadow-sm ${
              isUser
                ? "bg-gray-900 text-white dark:bg-gray-700"
                : "bg-white text-gray-900 dark:bg-gray-800 dark:text-white"
            }`}
          >
            {message}
          </div>
        </div>
      </div>
    </div>
  );
};
