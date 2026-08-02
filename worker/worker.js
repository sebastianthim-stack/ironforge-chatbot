// ============================================================================
// Forge - Gemini proxy (Cloudflare Worker)
// Holds the real Gemini API key as a Worker secret so it never ships to the
// browser or sits in the public GitHub repo. The frontend posts the same
// request body here; this Worker injects the key and forwards to Gemini.
//
// Secret binding required (Workers & Pages > Settings > Variables and Secrets):
//   GEMINI_API_KEY = <your AIza... key>
//
// Optional env var (not a secret) to lock CORS to one origin:
//   ALLOWED_ORIGIN = "https://your-user.github.io"
//   If unset, any origin may call it.
// ============================================================================

const GEMINI_BASE = "https://generativelanguage.googleapis.com/v1beta";

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    const allowed = env.ALLOWED_ORIGIN
      ? origin === env.ALLOWED_ORIGIN ? origin : null
      : origin || "*";

    // CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(allowed || "*"),
      });
    }

    if (!allowed) {
      return json({ error: "Origin not allowed" }, 403, "*");
    }

    if (request.method !== "POST") {
      return json({ error: "Method not allowed" }, 405, allowed);
    }

    const key = env.GEMINI_API_KEY;
    if (!key) {
      return json(
        { error: "GEMINI_API_KEY secret is not configured on this Worker." },
        500,
        allowed
      );
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return json({ error: "Invalid JSON body" }, 400, allowed);
    }

    const model = body.model || "gemini-3.5-flash";
    const payload = { ...body };
    delete payload.model;

    const resp = await fetch(
      `${GEMINI_BASE}/models/${model}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-goog-api-key": key,
        },
        body: JSON.stringify(payload),
      }
    );

    const text = await resp.text();
    return new Response(text, {
      status: resp.status,
      headers: {
        ...corsHeaders(allowed),
        "Content-Type": "application/json",
      },
    });
  },
};

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    Vary: "Origin",
  };
}

function json(obj, status, origin) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: {
      ...corsHeaders(origin),
      "Content-Type": "application/json",
    },
  });
}
