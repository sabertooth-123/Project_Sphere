"use client";

import { useTransition } from "react";
import Link from "next/link";
import {
  publishProjectAction,
  unpublishProjectAction,
  deleteProjectAction,
} from "../actions";

type Project = {
  id: string;
  slug: string;
  title: string;
  status: string;
  viewCount: number;
  likeCount: number;
};

export function ProjectManageRow({ project }: { project: Project }) {
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    if (!confirm(`Delete "${project.title}"? This can't be undone.`)) return;
    startTransition(() => deleteProjectAction(project.id));
  }

  return (
    <li className="flex items-center justify-between rounded-lg border border-border p-4">
      <div>
        <Link href={`/projects/${project.slug}`} className="font-medium hover:underline">
          {project.title}
        </Link>
        <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
          <span
            className={
              project.status === "PUBLISHED" ? "text-accent2" : "text-muted-foreground"
            }
          >
            {project.status === "PUBLISHED" ? "Published" : "Draft"}
          </span>
          <span className="font-mono tabular-nums">{project.viewCount} views</span>
          <span className="font-mono tabular-nums">{project.likeCount} likes</span>
        </div>
      </div>
      <div className="flex gap-3 text-xs">
        <Link href={`/projects/${project.slug}/edit`} className="underline">
          Edit
        </Link>
        {project.status === "PUBLISHED" ? (
          <button
            type="button"
            disabled={isPending}
            onClick={() => startTransition(() => unpublishProjectAction(project.id, project.slug))}
            className="underline"
          >
            Unpublish
          </button>
        ) : (
          <button
            type="button"
            disabled={isPending}
            onClick={() => startTransition(() => publishProjectAction(project.id, project.slug))}
            className="underline"
          >
            Publish
          </button>
        )}
        <button type="button" disabled={isPending} onClick={handleDelete} className="text-destructive underline">
          Delete
        </button>
      </div>
    </li>
  );
}
