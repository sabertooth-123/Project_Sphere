import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex max-w-md flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="font-display text-4xl font-bold">404</h1>
      <p className="text-muted-foreground">
        This page doesn&apos;t exist — it may have been unpublished or the link is wrong.
      </p>
      <Link
        href="/"
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Back home
      </Link>
    </main>
  );
}
