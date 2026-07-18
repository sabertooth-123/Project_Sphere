import { parseGithubRepo } from "@/utils/parseGithubUrl";

export type GithubCommit = {
  sha: string;
  message: string;
  date: string;
  url: string;
  authorName: string;
  authorAvatarUrl: string | null;
};

type GithubCommitApiItem = {
  sha: string;
  html_url: string;
  commit: {
    message: string;
    author: { name: string; date: string } | null;
  };
  author: { avatar_url: string } | null;
};

// Cached for an hour per repo — a live GitHub API call on every page view
// would risk the 60-req/hr unauthenticated rate limit under any real traffic.
export async function fetchRecentCommits(githubUrl: string, limit = 8): Promise<GithubCommit[]> {
  const parsed = parseGithubRepo(githubUrl);
  if (!parsed) return [];

  const headers: Record<string, string> = { Accept: "application/vnd.github+json" };
  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  }

  try {
    const res = await fetch(
      `https://api.github.com/repos/${parsed.owner}/${parsed.repo}/commits?per_page=${limit}`,
      { headers, next: { revalidate: 3600 } }
    );
    if (!res.ok) return [];

    const data: unknown = await res.json();
    if (!Array.isArray(data)) return [];

    return (data as GithubCommitApiItem[])
      .filter((c) => c.commit?.author)
      .map((c) => ({
        sha: c.sha,
        message: c.commit.message.split("\n")[0],
        date: c.commit.author!.date,
        url: c.html_url,
        authorName: c.commit.author!.name,
        authorAvatarUrl: c.author?.avatar_url ?? null,
      }));
  } catch {
    return [];
  }
}
