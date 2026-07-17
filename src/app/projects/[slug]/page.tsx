import { notFound } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";
import type { Metadata } from "next";
import { getProjectBySlug, isProjectOwner } from "@/services/projects";
import { getOrCreateCurrentUser } from "@/lib/getCurrentUser";
import { getViewerEngagement } from "@/services/engagement";
import { LikeButton } from "@/features/engagement/components/LikeButton";
import { BookmarkButton } from "@/features/engagement/components/BookmarkButton";
import { ViewTracker } from "@/features/engagement/components/ViewTracker";
import { CommentThread } from "@/features/comments/components/CommentThread";
import { ContributorManager } from "@/features/projects/components/ContributorManager";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project || project.status !== "PUBLISHED") {
    return { title: "Project Sphere" };
  }

  return {
    title: `${project.title} — Project Sphere`,
    description: project.shortDescription,
    openGraph: {
      title: project.title,
      description: project.shortDescription,
      images: project.coverImageUrl ? [project.coverImageUrl] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.shortDescription,
      images: project.coverImageUrl ? [project.coverImageUrl] : undefined,
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) notFound();

  const viewer = await getOrCreateCurrentUser();
  const isOwner = viewer ? await isProjectOwner(project.id, viewer.id) : false;

  if (project.status !== "PUBLISHED" && !isOwner) {
    notFound();
  }

  const { liked, bookmarked } = await getViewerEngagement(viewer?.id ?? null, project.id);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      {project.status === "PUBLISHED" && <ViewTracker slug={project.slug} />}

      {project.coverImageUrl ? (
        <div className="relative mb-8 h-64 w-full overflow-hidden rounded-lg">
          <Image
            src={project.coverImageUrl}
            alt={project.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      ) : (
        <div className="mb-8 h-64 w-full rounded-lg bg-muted" />
      )}

      {project.status === "DRAFT" && (
        <span className="mb-2 inline-block rounded-full bg-accent px-3 py-1 text-xs font-medium text-accent-foreground">
          Draft — only visible to you
        </span>
      )}

      <h1 className="font-display text-3xl font-bold mb-2">{project.title}</h1>
      <p className="text-lg text-muted-foreground mb-4">{project.shortDescription}</p>

      <div className="mb-6 flex items-center gap-3">
        <LikeButton
          projectId={project.id}
          slug={project.slug}
          initialLiked={liked}
          initialCount={project.likeCount}
        />
        <BookmarkButton
          projectId={project.id}
          slug={project.slug}
          initialBookmarked={bookmarked}
        />
        <span className="font-mono text-xs text-muted-foreground tabular-nums">
          {project.viewCount} views
        </span>
      </div>

      {/* Links live right under the fold, not after the full write-up — a visitor
          deciding "can I see this live?" shouldn't have to scroll past the essay first. */}
      {(project.githubUrl || project.liveUrl || project.documentationUrl) && (
        <section className="mb-6 flex flex-wrap gap-4 text-sm">
          {project.githubUrl && (
            <a href={project.githubUrl} className="underline" target="_blank" rel="noreferrer">
              GitHub
            </a>
          )}
          {project.liveUrl && (
            <a href={project.liveUrl} className="underline" target="_blank" rel="noreferrer">
              Live demo
            </a>
          )}
          {project.documentationUrl && (
            <a href={project.documentationUrl} className="underline" target="_blank" rel="noreferrer">
              Documentation
            </a>
          )}
        </section>
      )}

      {project.technologies.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {project.technologies.map(({ technology }) => (
            <span
              key={technology.id}
              className="rounded-md bg-accent2/10 px-2 py-1 font-mono text-xs text-accent2"
            >
              {technology.name}
            </span>
          ))}
        </div>
      )}

      <article className="mb-8 whitespace-pre-wrap text-sm leading-relaxed">
        {project.longDescription}
      </article>

      {(project.contributors.length > 0 || isOwner) && (
        <section className="mb-8">
          <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Contributors
          </h2>
          {isOwner ? (
            <ContributorManager
              projectId={project.id}
              slug={project.slug}
              contributors={project.contributors}
            />
          ) : (
            <div className="flex flex-wrap gap-4">
              {project.contributors.map((contributor) => (
                <span key={contributor.id} className="text-sm">
                  {contributor.user?.name ?? contributor.externalName} (
                  {contributor.role.toLowerCase()})
                </span>
              ))}
            </div>
          )}
        </section>
      )}

      <section>
        <h2 className="font-display text-lg font-semibold mb-4">Comments</h2>
        <Suspense fallback={<p className="text-sm text-muted-foreground">Loading comments…</p>}>
          <CommentThread projectId={project.id} slug={project.slug} currentUserId={viewer?.id ?? null} />
        </Suspense>
      </section>
    </main>
  );
}
