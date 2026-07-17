import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import { getUserByUsername } from "@/services/users";
import { listProjectsByOwner } from "@/services/projects";
import { ProjectCard } from "@/features/discovery/components/ProjectCard";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const user = await getUserByUsername(username);
  if (!user) return { title: "Project Sphere" };

  const description = user.headline || user.bio || `${user.name}'s projects on Project Sphere`;

  return {
    title: `${user.name} (@${user.username}) — Project Sphere`,
    description,
    openGraph: {
      title: user.name,
      description,
      images: user.avatarUrl ? [user.avatarUrl] : undefined,
    },
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const user = await getUserByUsername(username);
  if (!user) notFound();

  const projects = await listProjectsByOwner(user.id, { publishedOnly: true });

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8 flex items-start gap-5">
        {user.avatarUrl ? (
          <div className="relative size-20 shrink-0 overflow-hidden rounded-full">
            <Image src={user.avatarUrl} alt={user.name} fill className="object-cover" />
          </div>
        ) : (
          <div className="size-20 shrink-0 rounded-full bg-muted" />
        )}
        <div>
          <h1 className="font-display text-2xl font-bold">{user.name}</h1>
          <p className="text-sm text-muted-foreground">@{user.username}</p>
          {user.headline && <p className="mt-1 text-sm">{user.headline}</p>}
          {user.department && (
            <p className="mt-1 text-xs text-muted-foreground">{user.department.name}</p>
          )}
        </div>
      </div>

      {user.bio && <p className="mb-6 max-w-xl text-sm leading-relaxed">{user.bio}</p>}

      {user.skills.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {user.skills.map((s) => (
            <span
              key={s.technologyId}
              className="rounded-md bg-accent2/10 px-2 py-1 font-mono text-xs text-accent2"
            >
              {s.technology.name}
            </span>
          ))}
        </div>
      )}

      <div className="mb-10 flex flex-wrap gap-4 text-sm">
        {user.githubUrl && (
          <a href={user.githubUrl} className="underline" target="_blank" rel="noreferrer">
            GitHub
          </a>
        )}
        {user.linkedinUrl && (
          <a href={user.linkedinUrl} className="underline" target="_blank" rel="noreferrer">
            LinkedIn
          </a>
        )}
        {user.portfolioUrl && (
          <a href={user.portfolioUrl} className="underline" target="_blank" rel="noreferrer">
            Portfolio
          </a>
        )}
      </div>

      <h2 className="mb-4 font-display text-lg font-semibold">
        Projects ({projects.length})
      </h2>
      {projects.length === 0 ? (
        <p className="text-sm text-muted-foreground">No published projects yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </main>
  );
}
