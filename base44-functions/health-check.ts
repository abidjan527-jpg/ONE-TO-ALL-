// One-to-All: Health Check
// Verifies GITHUB_TOKEN is configured and GitHub Models API is reachable

export default async function handler(req: any) {
  const githubToken = process.env.GITHUB_TOKEN;
  
  const status: any = {
    service: "one-to-all",
    timestamp: new Date().toISOString(),
    status: "ok",
    provider: "github-models",
    features: {
      chat: true,
      models: true,
      embeddings: true,
      image_generation: false, // GitHub Models doesn't support image generation
    },
  };

  if (!githubToken) {
    status.status = "degraded";
    status.message = "GITHUB_TOKEN not configured. Set it in secrets to enable AI features.";
    return status;
  }

  try {
    // Test the token by listing models
    const res = await fetch("https://models.github.ai/catalog/models", {
      headers: { "Authorization": `Bearer ${githubToken}` },
    });

    if (res.ok) {
      const models = await res.json();
      status.models_count = Array.isArray(models) ? models.length : 0;
      status.token_valid = true;
      status.message = `GitHub Models API is live. ${status.models_count} models available.`;
      status.popular_models = ["openai/gpt-5", "openai/gpt-4o", "meta/llama-4-scout-17b-16e-instruct", "deepseek/deepseek-r1", "mistral-ai/mistral-small-2503"];
    } else {
      status.status = "degraded";
      status.token_valid = false;
      status.message = "GITHUB_TOKEN is set but invalid or expired.";
    }
  } catch (err: any) {
    status.status = "degraded";
    status.message = `Health check failed: ${err.message}`;
  }

  return status;
}
