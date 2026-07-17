import { listProjects } from "@/services/projects";
import { listCategories, listDepartments, listTechnologies } from "@/services/taxonomy";
import { parseExploreParams, type RawSearchParams } from "@/features/discovery/parseSearchParams";
import { FilterBar } from "@/features/discovery/components/FilterBar";
import { ProjectCard } from "@/features/discovery/components/ProjectCard";
import { buildQueryUrl } from "@/utils/buildQueryUrl";
import Link from "next/link";

const PAGE_SIZE = 12;

export default async function ExplorePage({
  searchParams,
}: {
  searchParams: Promise<RawSearchParams>;
}) {
  const sp = await searchParams;
  const filters = parseExploreParams(sp);

  const [projects, categories, departments, technologies] = await Promise.all([
    listProjects({ ...filters, limit: PAGE_SIZE }),
    listCategories(),
    listDepartments(),
    listTechnologies(),
  ]);

  const hasMore = projects.length === PAGE_SIZE;
  const nextCursor = hasMore ? projects[projects.length - 1]?.id : undefined;

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <h1 className="mb-6 font-display text-3xl font-bold">Explore</h1>

      <FilterBar
        categories={categories}
        departments={departments}
        technologies={technologies}
        defaults={{
          q: filters.q,
          categorySlug: filters.categorySlug,
          departmentSlug: filters.departmentSlug,
          technologySlugs: filters.technologySlugs,
          sort: filters.sort,
        }}
      />

      {projects.length === 0 ? (
        <p className="text-sm text-muted-foreground">No projects match those filters yet.</p>
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
            href={buildQueryUrl("/explore", sp, { cursor: nextCursor })}
            className="rounded-md border border-input px-4 py-2 text-sm font-medium"
          >
            Load more
          </Link>
        </div>
      )}
    </main>
  );
}
