import { Skeleton } from "@/components/shared/Skeleton";
import { ProjectCardSkeleton } from "@/features/discovery/components/ProjectCardSkeleton";

export default function HomeLoading() {
  return (
    <main>
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-6 pt-20 pb-16">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-5 w-96" />
        <div className="flex gap-3">
          <Skeleton className="h-10 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>
      <div className="border-y border-border">
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 px-6 py-14 sm:grid-cols-3">
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
          <Skeleton className="h-20" />
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-6 py-16">
        <Skeleton className="mb-4 h-7 w-64" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </div>
      </div>
    </main>
  );
}
