import Link from "next/link";
import Image from "next/image";

export type ProjectCardData = {
  slug: string;
  title: string;
  shortDescription: string;
  coverImageUrl: string | null;
  viewCount: number;
  likeCount: number;
};

export function ProjectCard({ project, role }: { project: ProjectCardData; role?: string }) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="group overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative h-32 w-full bg-muted">
        {project.coverImageUrl && (
          <Image src={project.coverImageUrl} alt={project.title} fill className="object-cover" />
        )}
        {role && role !== "OWNER" && (
          <span className="absolute right-2 top-2 rounded-full bg-background/90 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide text-muted-foreground">
            {role.toLowerCase()}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="mb-1 font-display text-base font-semibold group-hover:underline">
          {project.title}
        </h3>
        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
          {project.shortDescription}
        </p>
        <div className="flex gap-3 font-mono text-xs text-muted-foreground tabular-nums">
          <span>{project.viewCount} views</span>
          <span>{project.likeCount} likes</span>
        </div>
      </div>
    </Link>
  );
}
