import { generateResponse, GatewayError } from "@lovable.dev/ai-gateway";

/** Ask the model for a JSON object; returns parsed JSON. */
export async function askJson<T>(system: string, user: string): Promise<T> {
  try {
    const res = await generateResponse({
      model: "openai/gpt-6-astra",
      instructions: system,
      input: [{ role: "user", content: user + "\n\nReturn JSON only." }],
      text: { format: { type: "json_object" } },
    });
    let text = "";
    for (const item of (res as any).output ?? []) {
      if (item.type === "message") for (const c of item.content ?? []) if (c.type === "output_text") text += c.text;
    }
    if (!text && (res as any).output_text) text = (res as any).output_text;
    return JSON.parse(text) as T;
  } catch (e) {
    if (e instanceof GatewayError) {
      if (e.httpStatus === 429) throw new Error("The AI is busy right now. Please try again in a minute.");
      if (e.httpStatus === 402) throw new Error("AI credits are used up for this workspace.");
    }
    throw e instanceof Error ? e : new Error("AI evaluation failed");
  }
}

/** Public GitHub signal: top repos and languages. */
export async function githubSignal(url: string | null | undefined) {
  const m = url?.match(/github\.com\/([A-Za-z0-9-]+)/);
  if (!m) return null;
  const r = await fetch(`https://api.github.com/users/${m[1]}/repos?sort=updated&per_page=30`, {
    headers: { "user-agent": "hackhub", accept: "application/vnd.github+json" },
  });
  if (!r.ok) return null;
  const repos = (await r.json()) as any[];
  const langs: Record<string, number> = {};
  for (const x of repos) if (x.language) langs[x.language] = (langs[x.language] ?? 0) + 1;
  return {
    username: m[1],
    repoCount: repos.length,
    languages: langs,
    topRepos: repos.filter((x) => !x.fork).sort((a, b) => b.stargazers_count - a.stargazers_count).slice(0, 8)
      .map((x) => ({ name: x.name, description: x.description, language: x.language, stars: x.stargazers_count, topics: x.topics })),
  };
}
