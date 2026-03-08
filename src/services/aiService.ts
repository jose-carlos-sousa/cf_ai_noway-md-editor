import { Message } from "@/types";

export const aiService = {
  async sendMessage(markdown: string, userMessage: string, chatHistory: Message[]) {
    const response = await fetch("/api/ai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        markdown,
        userMessage,
        chatHistory,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI Service Error: ${response.statusText}`);
    }

    return (await response.json()) as { message: string };
  },
};