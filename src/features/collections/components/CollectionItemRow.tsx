"use client";

import { useTransition } from "react";
import Link from "next/link";
import { removeProjectFromCollectionAction } from "../actions";

export function CollectionItemRow({
  collectionId,
  project,
}: {
  collectionId: string;
  project: { id: string; slug: string; title: string };
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <li className="flex items-center justify-between rounded-lg border border-border p-4">
      <Link href={`/projects/${project.slug}`} className="font-medium hover:underline">
        {project.title}
      </Link>
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => removeProjectFromCollectionAction(collectionId, project.id))}
        className="text-xs text-destructive underline"
      >
        Remove
      </button>
    </li>
  );
}
