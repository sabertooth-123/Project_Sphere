import { Skeleton } from "@/components/shared/Skeleton";
import { ProjectCardSkeleton } from "@/features/discovery/components/ProjectCardSkeleton";

export default function HomeLoading() {
  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-16 flex flex-col items-center gap-4">
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-5 w-64" />
        <Skeleton className="h-10 w-36" />
      </div>
      <Skeleton className="mb-4 h-7 w-48" />
      <div className="mb-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
      </div>
    </main>
  );
}
