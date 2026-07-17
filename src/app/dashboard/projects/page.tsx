import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserByClerkId } from "@/services/users";
import { listProjectsByOwner } from "@/services/projects";
import { ProjectManageRow } from "@/features/projects/components/ProjectManageRow";

export default async function DashboardProjectsPage() {
  const { userId } = await auth.protect();
  const user = await getUserByClerkId(userId);
  if (!user) redirect("/");

  const projects = await listProjectsByOwner(user.id);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold">My projects</h1>
        <Link
          href="/projects/new"
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
        >
          New project
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-sm text-muted-foreground">You haven&apos;t published anything yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {projects.map((project) => (
            <ProjectManageRow key={project.id} project={project} />
          ))}
        </ul>
      )}
    </div>
  );
}
