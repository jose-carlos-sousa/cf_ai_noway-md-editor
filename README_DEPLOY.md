# noway-md-editor — Deploy & Run

This document explains how to deploy the two pieces used in this repository:

- `kv-worker`: a small standalone Cloudflare Worker that reads/writes the existing KV namespace for markdown storage.
- `noway-md-editor` Next.js app: bundled by OpenNext into a Worker (`.open-next/worker.js`) and deployed with Wrangler.

Paths in this repo:
- `kv-worker/worker.js` — KV worker source
- `kv-worker/wrangler.toml` — KV worker Wrangler config
- `src/app` — Next.js app (uses OpenNext build outputs in `.open-next`)

Deploy KV worker

1. From the repo root:

```bash
cd kv-worker
npx wrangler deploy
```

This will print the deployed worker URL (e.g. `https://noway-md-kv-api.<suffix>.workers.dev`).

Deploy the Next/OpenNext app

1. Build the Next app and deploy the OpenNext worker with Wrangler:

```bash
cd /path/to/noway-md-editor
npm run build
npx wrangler deploy
```

Notes
- The frontend expects two environment variables (optional):
  - `NEXT_PUBLIC_LLM_URL` — URL for your LLM worker (AI). Default is the included value in `src/app/page.tsx`.
  - `NEXT_PUBLIC_WORKER_URL` — URL for the KV worker. Set to the KV worker URL you get after deploying `kv-worker`.

Examples (curl)

Save markdown for user `noway`:

```bash
curl -i -X POST 'https://<kv-worker-url>/api/markdown' \
  -H 'Content-Type: application/json' \
  -d '{"username":"noway","markdown":"# hello from curl"}'
```

Fetch saved markdown:

```bash
curl -i 'https://<kv-worker-url>/api/markdown?username=noway'
```

If you want me to run these deploy steps here, say "deploy now" and I'll run them and report the URLs and quick smoke tests.
