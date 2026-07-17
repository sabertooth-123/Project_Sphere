import { Skeleton } from "@/components/shared/Skeleton";

export default function ProjectDetailLoading() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Skeleton className="mb-8 h-64 w-full" />
      <Skeleton className="mb-2 h-8 w-2/3" />
      <Skeleton className="mb-4 h-5 w-1/2" />
      <div className="mb-6 flex gap-3">
        <Skeleton className="h-8 w-16" />
        <Skeleton className="h-8 w-16" />
      </div>
      <div className="mb-6 flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="mb-2 h-4 w-full" />
      <Skeleton className="h-4 w-2/3" />
    </main>
  );
}
