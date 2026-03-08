import { getCloudflareContext } from "@opennextjs/cloudflare";
import { Message } from "@/types";

type AiRequestBody = {
  markdown: string;
  userMessage: string;
  chatHistory: Message[];
};

// Service bindings route by binding name, not DNS. This URL is only the request URL context.
const LLM_SERVICE_REQUEST_URL = "https://internal-llm/";

function jsonResponse(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function parseBody(request: Request): Promise<AiRequestBody | null> {
  const raw = await request.json().catch(() => null);
  if (!raw || typeof raw !== "object") return null;

  const { markdown, userMessage, chatHistory } = raw as Partial<AiRequestBody>;

  // Keep validation lightweight but reject obviously malformed payloads.
  if (!markdown?.trim?.() || !userMessage?.trim?.() || !Array.isArray(chatHistory)) {
    return null;
  }

  return { markdown, userMessage, chatHistory };
}

export async function POST(request: Request) {
  try {
    const body = await parseBody(request);
    if (!body) {
      return jsonResponse({ error: "markdown, userMessage, and chatHistory are required" }, 400);
    }

    const { env } = getCloudflareContext();
    const llmBinding = (env as { LLM_WORKER?: Fetcher }).LLM_WORKER;
    if (!llmBinding) {
      return jsonResponse({ error: "LLM worker binding not configured" }, 500);
    }

    const upstream = await llmBinding.fetch(LLM_SERVICE_REQUEST_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const responseText = await upstream.text();
    const contentType = upstream.headers.get("content-type") || "application/json";

    return new Response(responseText, {
      status: upstream.status,
      headers: { "Content-Type": contentType },
    });
  } catch (err) {
    console.error("AI route error:", err);
    return jsonResponse({ error: "internal" }, 500);
  }
}