# KV Worker (standalone)

Minimal Cloudflare Worker to read/write a KV namespace.

Deploy:

```bash
cd kv-worker
npx wrangler deploy
```

Examples (replace with your worker URL):

POST (save):
```bash
curl -i -X POST 'https://<your-worker>.workers.dev/api/markdown' \
  -H 'Content-Type: application/json' \
  -d '{"username":"noway","markdown":"# hello"}'
```

GET (load):
```bash
curl -i 'https://<your-worker>.workers.dev/api/markdown?username=noway'
```
