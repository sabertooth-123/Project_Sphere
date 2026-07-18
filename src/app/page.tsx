import Link from "next/link";
import { listProjects } from "@/services/projects";
import { ProjectCard } from "@/features/discovery/components/ProjectCard";
import { HeroBackground } from "@/components/shared/HeroBackground";
import { HeroContent } from "@/components/shared/HeroContent";

// Prisma calls alone don't force dynamic rendering — without this, the
// trending teaser would be baked in at build time and go stale until deploy.
export const revalidate = 60;

const STEPS = [
  {
    title: "Publish what you built",
    description:
      "Cover image, tech stack, contributors, links to your repo and live demo — one page that actually does your project justice.",
  },
  {
    title: "Get discovered",
    description:
      "Browsable by technology, category, and department — not just searchable if someone already knows your project's name.",
  },
  {
    title: "Get noticed",
    description:
      "A public profile you can put on a resume, a recruiter's link that needs zero login, and real signal from likes and views.",
  },
];

export default async function Home() {
  const trending = await listProjects({ sort: "trending", limit: 3 });

  return (
    <main>
      <section className="relative">
        <HeroBackground />
        <HeroContent />
      </section>

      <section className="border-y border-border bg-card/50">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-6 py-14 sm:grid-cols-3">
          {STEPS.map((step, i) => (
            <div key={step.title} className="flex flex-col gap-2">
              <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="font-display text-lg font-semibold">{step.title}</h2>
              <p className="text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold">A taste of what&apos;s out there</h2>
          <Link href="/explore" className="text-sm underline">
            See all in Explore
          </Link>
        </div>
        {trending.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing published yet — be the first.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {trending.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
