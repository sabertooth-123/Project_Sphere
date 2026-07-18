import { Skeleton } from "@/components/shared/Skeleton";

export function GitHubTimelineSkeleton() {
  return (
    <section className="mb-8">
      <Skeleton className="mb-3 h-4 w-32" />
      <div className="flex flex-col gap-4 border-l border-border pl-4">
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/3" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
    </section>
  );
}
