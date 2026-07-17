import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrCreateCurrentUser } from "@/lib/getCurrentUser";
import { listBookmarkedProjects } from "@/services/engagement";
import { ProjectCard } from "@/features/discovery/components/ProjectCard";

export default async function DashboardBookmarksPage() {
  await auth.protect();
  const user = await getOrCreateCurrentUser();
  if (!user) redirect("/");

  const projects = await listBookmarkedProjects(user.id);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Bookmarks</h1>

      {projects.length === 0 ? (
        <p className="text-sm text-muted-foreground">Nothing saved yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
