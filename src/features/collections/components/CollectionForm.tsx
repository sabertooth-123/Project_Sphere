"use client";

import { useActionState } from "react";
import { createCollectionAction } from "../actions";
import type { ActionResult } from "@/types/api";

export function CollectionForm() {
  const [state, formAction, pending] = useActionState<ActionResult<null> | null, FormData>(
    createCollectionAction,
    null
  );

  return (
    <form action={formAction} className="flex flex-col gap-3 rounded-lg border border-border p-4">
      <label className="flex flex-col gap-1 text-sm">
        Name
        <input name="name" required className="rounded-md border border-input px-3 py-2 text-sm" />
      </label>
      <label className="flex flex-col gap-1 text-sm">
        Description
        <input name="description" className="rounded-md border border-input px-3 py-2 text-sm" />
      </label>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" name="isPublic" defaultChecked />
        Public
      </label>
      {state && !state.success && <p className="text-xs text-destructive">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {pending ? "Creating…" : "Create collection"}
      </button>
    </form>
  );
}
