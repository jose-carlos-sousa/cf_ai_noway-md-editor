// KV-backed Worker
// GET  /api/markdown?username=NAME -> returns stored markdown or 204
// POST /api/markdown             -> { username, markdown } -> stores markdown

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    try {
      const url = new URL(request.url);

      if (request.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: CORS_HEADERS });
      }

      if (url.pathname === "/api/markdown") {
        if (request.method === "GET") {
          const username = url.searchParams.get("username");
          if (!username) {
            return new Response(JSON.stringify({ error: "username query param required" }), {
              status: 400,
              headers: { ...CORS_HEADERS, "Content-Type": "application/json" },
            });
          }
          const key = `user:${username}`;
          const value = await env.KV.get(key);
          if (value === null) {
            return new Response(null, { status: 204, headers: CORS_HEADERS });
          }
          return new Response(value, { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "text/plain; charset=utf-8" } });
        }

        if (request.method === "POST") {
          let body;
          try {
            body = await request.json();
          } catch (err) {
            return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
          }
          const { username, markdown } = body || {};
          if (!username || typeof markdown !== "string") {
            return new Response(JSON.stringify({ error: "username and markdown required" }), { status: 400, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
          }
          const key = `user:${username}`;
          await env.KV.put(key, markdown);
          return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
        }

        return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
      }

      return new Response("Not found", { status: 404, headers: CORS_HEADERS });
    } catch (err) {
      console.error("Worker error:", err);
      return new Response(JSON.stringify({ error: "internal" }), { status: 500, headers: { ...CORS_HEADERS, "Content-Type": "application/json" } });
    }
  },
};
