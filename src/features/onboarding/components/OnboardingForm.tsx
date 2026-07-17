"use client";

import { useActionState } from "react";
import { completeOnboarding } from "../actions";
import type { ActionResult } from "@/types/api";

type Department = { id: string; name: string };

export function OnboardingForm({
  departments,
  defaultUsername,
  defaultName,
}: {
  departments: Department[];
  defaultUsername: string;
  defaultName: string;
}) {
  const [state, formAction, pending] = useActionState<ActionResult<null> | null, FormData>(
    completeOnboarding,
    null
  );

  const errors = state && !state.success ? state.fieldErrors ?? {} : {};

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-md">
      {state && !state.success && (
        <p className="text-sm text-destructive">{state.error}</p>
      )}

      <label className="flex flex-col gap-1 text-sm">
        Username
        <input
          name="username"
          defaultValue={defaultUsername}
          required
          className="rounded-md border px-3 py-2 text-sm"
        />
        {errors.username && <span className="text-xs text-destructive">{errors.username[0]}</span>}
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Name
        <input
          name="name"
          defaultValue={defaultName}
          required
          className="rounded-md border px-3 py-2 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Headline
        <input
          name="headline"
          placeholder="e.g. CS junior building ML side projects"
          className="rounded-md border px-3 py-2 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Bio
        <textarea name="bio" rows={3} className="rounded-md border px-3 py-2 text-sm" />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Department
        <select name="departmentId" className="rounded-md border px-3 py-2 text-sm">
          <option value="">Prefer not to say</option>
          {departments.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Skills
        <input
          name="skills"
          placeholder="React, PyTorch, PostgreSQL"
          className="rounded-md border px-3 py-2 text-sm"
        />
        <span className="text-xs text-muted-foreground">Comma-separated.</span>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        GitHub URL
        <input name="githubUrl" type="url" className="rounded-md border px-3 py-2 text-sm" />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        LinkedIn URL
        <input name="linkedinUrl" type="url" className="rounded-md border px-3 py-2 text-sm" />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Portfolio URL
        <input name="portfolioUrl" type="url" className="rounded-md border px-3 py-2 text-sm" />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium disabled:opacity-50"
      >
        {pending ? "Saving..." : "Finish setup"}
      </button>
    </form>
  );
}
