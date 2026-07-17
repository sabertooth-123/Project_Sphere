"use client";

import { useActionState, useTransition } from "react";
import { addContributorAction, removeContributorAction } from "../actions";
import type { ActionResult } from "@/types/api";

type Contributor = {
  id: string;
  role: string;
  user: { name: string; username: string } | null;
  externalName: string | null;
};

export function ContributorManager({
  projectId,
  slug,
  contributors,
}: {
  projectId: string;
  slug: string;
  contributors: Contributor[];
}) {
  const boundAddAction = addContributorAction.bind(null, projectId, slug);
  const [state, formAction, pending] = useActionState<ActionResult<null> | null, FormData>(
    boundAddAction,
    null
  );
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-4">
      <ul className="flex flex-col gap-2">
        {contributors.map((c) => (
          <li key={c.id} className="flex items-center justify-between text-sm">
            <span>
              {c.user ? `${c.user.name} (@${c.user.username})` : c.externalName} —{" "}
              <span className="text-muted-foreground">{c.role.toLowerCase()}</span>
            </span>
            {c.role !== "OWNER" && (
              <button
                type="button"
                disabled={isPending}
                onClick={() => startTransition(() => removeContributorAction(c.id, projectId, slug))}
                className="text-xs text-destructive underline"
              >
                Remove
              </button>
            )}
          </li>
        ))}
      </ul>

      <form action={formAction} className="flex flex-wrap items-end gap-2">
        <label className="flex flex-col gap-1 text-xs">
          Username (platform member)
          <input name="username" className="rounded-md border border-input px-2 py-1 text-sm" />
        </label>
        <label className="flex flex-col gap-1 text-xs">
          or external name
          <input name="externalName" className="rounded-md border border-input px-2 py-1 text-sm" />
        </label>
        <label className="flex flex-col gap-1 text-xs">
          Role
          <select name="role" className="rounded-md border border-input px-2 py-1 text-sm">
            <option value="CONTRIBUTOR">Contributor</option>
            <option value="MENTOR">Mentor</option>
          </select>
        </label>
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
        >
          Add
        </button>
      </form>
      {state && !state.success && <p className="text-xs text-destructive">{state.error}</p>}
    </div>
  );
}
