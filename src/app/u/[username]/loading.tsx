import { Skeleton } from "@/components/shared/Skeleton";
import { ProjectCardSkeleton } from "@/features/discovery/components/ProjectCardSkeleton";

export default function ProfileLoading() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8 flex items-start gap-5">
        <Skeleton className="size-20 shrink-0 rounded-full" />
        <div className="flex flex-1 flex-col gap-2 pt-1">
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <Skeleton className="mb-6 h-4 w-2/3" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <ProjectCardSkeleton />
        <ProjectCardSkeleton />
      </div>
    </main>
  );
}
