# Cloudflare Worker setup (hides your Gemini key)

The bot calls Google Gemini directly from the browser. On a public GitHub Pages site,
that means the API key sits in the repo and page source, and Google's **leak detection
disables it** (you saw the `403 "API key reported as leaked"`). The fix: a free
Cloudflare Worker that holds the key as a **secret** and proxies the calls. The key
then never appears in the repo or the page, and it stops getting killed.

The code is ready in `worker/worker.js`. Deploy it from the Cloudflare dashboard —
no terminal needed.

## Steps (5 minutes)

1. **Create a free Cloudflare account** at https://dash.cloudflare.com/sign-up
   (no credit card required).

2. Go to **Workers & Pages → Create → Worker** → name it `ironforge-gemini` →
   **Deploy**.

3. Open your worker → **Edit code**. Delete the default code and paste the entire
   contents of `worker/worker.js` → **Deploy**.

4. **Create a fresh Gemini API key** at https://aistudio.google.com/apikey
   (the current one was already flagged as leaked — don't reuse it).

5. Add it as a **secret**: your worker → **Settings → Variables and Secrets →
   Add**:
   - Type: **Secret**, Name: `GEMINI_API_KEY`, Value: the `AIza...` key → Save.

6. Optional (recommended): add a plain **Environment Variable** `ALLOWED_ORIGIN`
   = `https://YOUR_USERNAME.github.io` so only your Pages site may call the Worker.

7. Copy your worker's URL: `https://ironforge-gemini.YOUR_ACCOUNT.workers.dev`.

## Point the bot at it

In `config.js` set:

```js
PROXY_URL: "https://ironforge-gemini.YOUR_ACCOUNT.workers.dev",
API_KEY: "",   // stays empty - the key now lives only on the Worker
```

Push the update to GitHub Pages. The bot now works with zero keys in the repo.

## Verify

Open the live bot and ask a question. Status strip should update normally.
You can also test the worker directly:

```bash
curl -X POST "https://ironforge-gemini.YOUR_ACCOUNT.workers.dev" \
  -H "Content-Type: application/json" \
  -d '{"model":"gemini-3.5-flash","contents":[{"parts":[{"text":"Say OK"}]}]}'
```

Expect `"text": "OK"` back. If you see `"GEMINI_API_KEY secret is not configured"`,
the secret wasn't saved on the Worker.

## Quota note

Free-tier Gemini allows a limited number of requests per day per model (the exact
limit is shown in the 429 error). For the screenshots and the post-deadline check that
is usually enough. If you need it bulletproof, you can enable pay-as-you-go billing
in Google AI Studio — usage costs pennies for this traffic.
