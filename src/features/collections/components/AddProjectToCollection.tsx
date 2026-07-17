"use client";

import { useState, useTransition } from "react";
import { addProjectToCollectionAction } from "../actions";

type Option = { id: string; title: string };

export function AddProjectToCollection({
  collectionId,
  options,
}: {
  collectionId: string;
  options: Option[];
}) {
  const [selected, setSelected] = useState(options[0]?.id ?? "");
  const [isPending, startTransition] = useTransition();

  if (options.length === 0) {
    return (
      <p className="text-xs text-muted-foreground">
        Bookmark a project first, then add it here.
      </p>
    );
  }

  return (
    <div className="flex gap-2">
      <select
        value={selected}
        onChange={(e) => setSelected(e.target.value)}
        className="rounded-md border border-input px-3 py-2 text-sm"
      >
        {options.map((o) => (
          <option key={o.id} value={o.id}>
            {o.title}
          </option>
        ))}
      </select>
      <button
        type="button"
        disabled={isPending}
        onClick={() => startTransition(() => addProjectToCollectionAction(collectionId, selected))}
        className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        Add
      </button>
    </div>
  );
}
