export function parseGithubRepo(url: string): { owner: string; repo: string } | null {
  try {
    const parsed = new URL(url);
    if (!parsed.hostname.endsWith("github.com")) return null;

    const parts = parsed.pathname.split("/").filter(Boolean);
    if (parts.length < 2) return null;

    const [owner, repoRaw] = parts;
    const repo = repoRaw.replace(/\.git$/, "");
    if (!owner || !repo) return null;

    return { owner, repo };
  } catch {
    return null;
  }
}
