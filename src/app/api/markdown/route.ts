import { getCloudflareContext } from "@opennextjs/cloudflare";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function jsonResponse(body: Record<string, unknown>, status: number) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
  });
}

function getKvBinding() {
  const { env } = getCloudflareContext();
  return (env as { KV?: KVNamespace }).KV;
}

function textResponse(body: string) {
  return new Response(body, {
    status: 200,
    headers: {
      ...CORS_HEADERS,
      "Content-Type": "text/plain; charset=utf-8",
    },
  });
}

async function parseSaveBody(request: Request): Promise<{ username: string; markdown: string } | null> {
  const raw = await request.json().catch(() => null);
  if (!raw || typeof raw !== "object") return null;

  const { username, markdown } = raw as { username?: string; markdown?: string };
  if (!username?.trim?.() || typeof markdown !== "string") return null;

  return { username, markdown };
}

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS_HEADERS });
}

export async function GET(request: Request) {
  try {
    const username = new URL(request.url).searchParams.get("username");
    if (!username) {
      return jsonResponse({ error: "username query param required" }, 400);
    }

    const kv = getKvBinding();
    if (!kv) {
      return jsonResponse({ error: "KV binding not configured" }, 500);
    }

    const key = `user:${username}`;
    const value = await kv.get(key);

    if (value === null) {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    return textResponse(value);
  } catch (err) {
    console.error("Markdown GET error:", err);
    return jsonResponse({ error: "internal" }, 500);
  }
}

export async function POST(request: Request) {
  try {
    const kv = getKvBinding();
    if (!kv) {
      return jsonResponse({ error: "KV binding not configured" }, 500);
    }

    const body = await parseSaveBody(request);
    if (!body) {
      return jsonResponse({ error: "username and markdown required" }, 400);
    }

    await kv.put(`user:${body.username}`, body.markdown);
    return jsonResponse({ ok: true }, 200);
  } catch (err) {
    console.error("Markdown POST error:", err);
    return jsonResponse({ error: "internal" }, 500);
  }
}