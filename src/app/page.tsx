import Link from "next/link";
import { listProjects } from "@/services/projects";
import { ProjectCard } from "@/features/discovery/components/ProjectCard";

// Prisma calls alone don't force dynamic rendering — without this, "trending"/
// "recent" would be baked in at build time and go stale until the next deploy.
export const revalidate = 60;

export default async function Home() {
  const [trending, recent] = await Promise.all([
    listProjects({ sort: "trending", limit: 3 }),
    listProjects({ sort: "recent", limit: 3 }),
  ]);

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <section className="mb-16 flex flex-col items-center gap-4 text-center">
        <h1 className="font-display text-4xl font-semibold">
          Show the world what you built
        </h1>
        <p className="max-w-md text-muted-foreground">
          Discover student projects by tech, department, or competition — or publish your own.
        </p>
        <Link
          href="/explore"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Explore projects
        </Link>
      </section>

      <section className="mb-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Trending this week</h2>
          <Link href="/explore?sort=trending" className="text-sm underline">
            See all
          </Link>
        </div>
        {trending.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing trending yet — be the first to publish.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trending.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">Recently added</h2>
          <Link href="/explore?sort=recent" className="text-sm underline">
            See all
          </Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-muted-foreground">No projects published yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {recent.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
