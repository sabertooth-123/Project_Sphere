"use client";

import { useActionState, useEffect } from "react";
import { toast } from "sonner";
import { updateProfileAction } from "../actions";
import type { ActionResult } from "@/types/api";

type Department = { id: string; name: string };

export function ProfileEditForm({
  departments,
  defaults,
}: {
  departments: Department[];
  defaults: {
    username: string;
    name: string;
    headline: string;
    bio: string;
    departmentId: string;
    githubUrl: string;
    linkedinUrl: string;
    portfolioUrl: string;
    skills: string;
  };
}) {
  const [state, formAction, pending] = useActionState<ActionResult<null> | null, FormData>(
    updateProfileAction,
    null
  );

  const errors = state && !state.success ? state.fieldErrors ?? {} : {};

  useEffect(() => {
    if (state?.success) toast.success("Profile updated");
  }, [state]);

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-md">
      {state && !state.success && <p className="text-sm text-destructive">{state.error}</p>}

      <label className="flex flex-col gap-1 text-sm">
        Username
        <input
          name="username"
          defaultValue={defaults.username}
          required
          className="rounded-md border border-input px-3 py-2 text-sm"
        />
        {errors.username && <span className="text-xs text-destructive">{errors.username[0]}</span>}
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Name
        <input
          name="name"
          defaultValue={defaults.name}
          required
          className="rounded-md border border-input px-3 py-2 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Headline
        <input
          name="headline"
          defaultValue={defaults.headline}
          className="rounded-md border border-input px-3 py-2 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Bio
        <textarea
          name="bio"
          defaultValue={defaults.bio}
          rows={3}
          className="rounded-md border border-input px-3 py-2 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Department
        <select
          name="departmentId"
          defaultValue={defaults.departmentId}
          className="rounded-md border border-input px-3 py-2 text-sm"
        >
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
          defaultValue={defaults.skills}
          placeholder="React, PyTorch, PostgreSQL"
          className="rounded-md border border-input px-3 py-2 text-sm"
        />
        <span className="text-xs text-muted-foreground">Comma-separated.</span>
      </label>

      <label className="flex flex-col gap-1 text-sm">
        GitHub URL
        <input
          name="githubUrl"
          type="url"
          defaultValue={defaults.githubUrl}
          className="rounded-md border border-input px-3 py-2 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        LinkedIn URL
        <input
          name="linkedinUrl"
          type="url"
          defaultValue={defaults.linkedinUrl}
          className="rounded-md border border-input px-3 py-2 text-sm"
        />
      </label>

      <label className="flex flex-col gap-1 text-sm">
        Portfolio URL
        <input
          name="portfolioUrl"
          type="url"
          defaultValue={defaults.portfolioUrl}
          className="rounded-md border border-input px-3 py-2 text-sm"
        />
      </label>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 self-start rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium disabled:opacity-50"
      >
        {pending ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
