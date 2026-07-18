import { fetchRecentCommits } from "@/lib/github";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export async function GitHubTimeline({ githubUrl }: { githubUrl: string }) {
  const commits = await fetchRecentCommits(githubUrl);
  if (commits.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Recent activity
        </h2>
        <a
          href={`${githubUrl.replace(/\/$/, "")}/commits`}
          target="_blank"
          rel="noreferrer"
          className="text-xs underline"
        >
          Full history on GitHub
        </a>
      </div>
      <ol className="flex flex-col gap-4 border-l border-border pl-4">
        {commits.map((c) => (
          <li key={c.sha}>
            <a
              href={c.url}
              target="_blank"
              rel="noreferrer"
              className="text-sm hover:underline"
            >
              {c.message}
            </a>
            <div className="mt-0.5 font-mono text-xs text-muted-foreground">
              {c.authorName} · {formatDate(c.date)}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
