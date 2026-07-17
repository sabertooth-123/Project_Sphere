import { Skeleton } from "@/components/shared/Skeleton";
import { ProjectCardSkeleton } from "@/features/discovery/components/ProjectCardSkeleton";

export default function ExploreLoading() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <Skeleton className="mb-6 h-9 w-40" />
      <Skeleton className="mb-8 h-40 w-full" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <ProjectCardSkeleton key={i} />
        ))}
      </div>
    </main>
  );
}
