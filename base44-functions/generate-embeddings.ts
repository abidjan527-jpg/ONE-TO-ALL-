// One-to-All: Generate Embeddings via GitHub Models
// Uses OpenAI embedding models available through GitHub Models

const GITHUB_MODELS_BASE = "https://models.github.ai/inference";

export default async function handler(req: any) {
  const body = req.body || req;
  const { input, model = "openai/text-embedding-3-small" } = body;

  if (!input) {
    return { error: "Missing required field: input (string or string[])" };
  }

  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    return { error: "GITHUB_TOKEN not configured. Set it in secrets." };
  }

  try {
    const res = await fetch(`${GITHUB_MODELS_BASE}/embeddings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${githubToken}`,
      },
      body: JSON.stringify({
        model,
        input: Array.isArray(input) ? input : [input],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return { error: "Embeddings failed", message: `GitHub Models error: ${err}` };
    }

    const data = await res.json();

    return {
      model: data.model,
      provider: "github-models",
      embeddings: data.data?.map((d: any) => d.embedding) || [],
      usage: data.usage,
      metadata: { powered_by: "GitHub Models (free tier)" },
    };
  } catch (err: any) {
    return { error: "Embeddings failed", message: err.message };
  }
}
