// One-to-All: List Available Models via GitHub Models
// Returns all 37+ models available through GitHub Models free tier

const GITHUB_MODELS_BASE = "https://models.github.ai/inference";

export default async function handler(req: any) {
  const githubToken = process.env.GITHUB_TOKEN;

  if (!githubToken) {
    return { error: "GITHUB_TOKEN not configured. Set it in secrets." };
  }

  try {
    const res = await fetch("https://models.github.ai/catalog/models", {
      headers: {
        "Authorization": `Bearer ${githubToken}`,
      },
    });

    if (!res.ok) {
      const err = await res.text();
      return { error: "Failed to fetch models", message: err };
    }

    const models = await res.json();

    // Categorize models by provider
    const categorized: Record<string, string[]> = {};
    const allModels: string[] = [];

    if (Array.isArray(models)) {
      for (const m of models) {
        const id = typeof m === "string" ? m : m.id || m.name || "";
        if (!id) continue;
        allModels.push(id);
        const provider = id.split("/")[0] || "other";
        if (!categorized[provider]) categorized[provider] = [];
        categorized[provider].push(id);
      }
    }

    return {
      total: allModels.length,
      models: allModels,
      categories: categorized,
      provider: "github-models",
      powered_by: "GitHub Models (free tier)",
      note: "All models are free with a GitHub token. No individual API keys needed.",
    };
  } catch (err: any) {
    return { error: "Failed to list models", message: err.message };
  }
}
