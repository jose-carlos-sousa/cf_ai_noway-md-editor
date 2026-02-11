import { useState } from "react";
import { Message } from "@/types";
import { aiService } from "@/services/aiService";
import { extractMarkdown, extractExplanation } from "@/utils/markdownUtils";
import { useDiffReview } from "./useDiffReview";

export function useAIChat(markdown: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const [showAI, setShowAI] = useState(true);

  // Integrate diff review logic
  const diffReview = useDiffReview();

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: userMsg }]);
    setIsLoading(true);

    try {
      const data = await aiService.sendMessage(markdown, userMsg, messages);
      const aiMessage = data.message;

      const newMarkdown = extractMarkdown(aiMessage);
      const explanation = extractExplanation(aiMessage);

      setMessages((prev) => [...prev, { role: "assistant", content: explanation }]);

      if (newMarkdown) {
        // Trigger diff review
        diffReview.createDiff(markdown, newMarkdown);
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error connecting to AI. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    input,
    setInput,
    showAI,
    setShowAI,
    sendMessage,
    ...diffReview,
  };
}