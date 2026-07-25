// One-to-All: Unified AI Chat Completion via GitHub Models
// 37+ models: GPT-5, GPT-4o, Llama 4, DeepSeek-R1, Mistral, Phi-4 — all free with GitHub token

interface ChatRequest {
  model: string;
  messages: { role: string; content: string }[];
  temperature?: number;
  max_tokens?: number;
}

const GITHUB_MODELS_BASE = "https://models.github.ai/inference";

Deno.serve(async (req: Request) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }

  try {
    const body: ChatRequest = await req.json();
    const { model, messages, temperature, max_tokens } = body;

    if (!model || !messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Missing required fields: model and messages[]" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const githubToken = Deno.env.get("GITHUB_TOKEN");
    if (!githubToken) {
      return new Response(
        JSON.stringify({ error: "GITHUB_TOKEN not configured. Set it in secrets." }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const res = await fetch(`${GITHUB_MODELS_BASE}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${githubToken}`,
      },
      body: JSON.stringify({
        model,
        messages,
        temperature: temperature ?? 0.7,
        max_tokens: max_tokens ?? 1000,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return new Response(
        JSON.stringify({ error: "Chat completion failed", message: `GitHub Models error: ${err}` }),
        { status: res.status, headers: { "Content-Type": "application/json" } }
      );
    }

    const data = await res.json();

    return new Response(
      JSON.stringify({
        id: data.id,
        model: data.model,
        provider: "github-models",
        choices: data.choices,
        usage: data.usage,
        metadata: {
          provider: "github-models",
          model,
          powered_by: "GitHub Models (free tier)",
        },
      }),
      { status: 200, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: "Chat completion failed", message: err.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
