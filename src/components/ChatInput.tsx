import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export const ChatInput = ({ onSend, disabled }: ChatInputProps) => {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input.trim());
      setInput("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-end">
      <Textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Ask me about diseases, symptoms, or prevention..."
        disabled={disabled}
        className="min-h-[60px] max-h-[120px] resize-none bg-card border-input focus:border-primary transition-colors"
        rows={2}
      />
      <Button
        type="submit"
        disabled={disabled || !input.trim()}
        className="h-[60px] px-6 bg-gradient-medical hover:opacity-90 transition-all hover:scale-105 shadow-medical"
      >
        <Send className="w-5 h-5" />
      </Button>
    </form>
  );
};
