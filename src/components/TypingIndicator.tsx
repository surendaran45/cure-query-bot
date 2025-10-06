import { Bot } from "lucide-react";

export const TypingIndicator = () => {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-medical flex items-center justify-center shadow-medical">
        <Bot className="w-5 h-5 text-white" />
      </div>
      <div className="max-w-[80%] rounded-2xl rounded-tl-none px-4 py-3 bg-accent shadow-soft">
        <div className="flex gap-1.5 items-center">
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" style={{ animationDelay: "0ms" }} />
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" style={{ animationDelay: "150ms" }} />
          <div className="w-2 h-2 rounded-full bg-primary animate-pulse-soft" style={{ animationDelay: "300ms" }} />
        </div>
      </div>
    </div>
  );
};
