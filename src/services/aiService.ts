import { Message } from "@/types";

const LLM_WORKER_URL = process.env.NEXT_PUBLIC_LLM_URL || "https://my-llama-xd.2409jmsousa.workers.dev";

export const aiService = {
  async sendMessage(markdown: string, userMessage: string, chatHistory: Message[]) {
    const response = await fetch(LLM_WORKER_URL, {
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