import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getOrCreateCurrentUser } from "@/lib/getCurrentUser";
import { listProjectsByOwner } from "@/services/projects";
import { listBookmarkedProjects } from "@/services/engagement";

export default async function DashboardPage() {
  await auth.protect();
  const user = await getOrCreateCurrentUser();

  if (!user) redirect("/");
  if (!user.onboardingCompletedAt) redirect("/onboarding");

  const [projects, bookmarks] = await Promise.all([
    listProjectsByOwner(user.id),
    listBookmarkedProjects(user.id),
  ]);

  const published = projects.filter((p) => p.status === "PUBLISHED").length;
  const drafts = projects.filter((p) => p.status === "DRAFT").length;

  return (
    <div>
      <h1 className="font-display text-2xl font-bold mb-2">Welcome, {user.name}</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        <Link href={`/u/${user.username}`} className="underline">
          View your public profile
        </Link>
      </p>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-border p-4">
          <p className="font-mono text-2xl tabular-nums">{published}</p>
          <p className="text-xs text-muted-foreground">Published projects</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="font-mono text-2xl tabular-nums">{drafts}</p>
          <p className="text-xs text-muted-foreground">Drafts</p>
        </div>
        <div className="rounded-lg border border-border p-4">
          <p className="font-mono text-2xl tabular-nums">{bookmarks.length}</p>
          <p className="text-xs text-muted-foreground">Bookmarks</p>
        </div>
      </div>

      <Link
        href="/projects/new"
        className="mt-8 inline-block rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        New project
      </Link>
    </div>
  );
}
