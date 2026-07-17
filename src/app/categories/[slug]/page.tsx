import { notFound } from "next/navigation";
import Link from "next/link";
import { getCategoryBySlug } from "@/services/taxonomy";
import { listProjects } from "@/services/projects";
import { parseExploreParams, type RawSearchParams } from "@/features/discovery/parseSearchParams";
import { ProjectCard } from "@/features/discovery/components/ProjectCard";
import { SortLinks } from "@/features/discovery/components/SortLinks";
import { buildQueryUrl } from "@/utils/buildQueryUrl";

const PAGE_SIZE = 12;

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<RawSearchParams>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const filters = parseExploreParams(sp);
  const projects = await listProjects({
    ...filters,
    categorySlug: slug,
    limit: PAGE_SIZE,
  });

  const hasMore = projects.length === PAGE_SIZE;
  const nextCursor = hasMore ? projects[projects.length - 1]?.id : undefined;
  const basePath = `/categories/${slug}`;

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="mb-2 font-display text-3xl font-bold">{category.name}</h1>
      {category.description && (
        <p className="mb-6 text-muted-foreground">{category.description}</p>
      )}

      <SortLinks basePath={basePath} currentParams={sp} activeSort={filters.sort} />

      {projects.length === 0 ? (
        <p className="text-sm text-muted-foreground">No projects in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <Link
            href={buildQueryUrl(basePath, sp, { cursor: nextCursor })}
            className="rounded-md border border-input px-4 py-2 text-sm font-medium"
          >
            Load more
          </Link>
        </div>
      )}
    </main>
  );
}
