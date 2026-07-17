"use client";

import { useActionState, useRef, useEffect } from "react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { addCommentAction } from "../actions";
import type { ActionResult } from "@/types/api";

export function CommentForm({
  projectId,
  slug,
  parentId,
  placeholder = "Leave a comment…",
}: {
  projectId: string;
  slug: string;
  parentId?: string;
  placeholder?: string;
}) {
  const { isSignedIn } = useAuth();
  const clerk = useClerk();
  const [state, formAction, pending] = useActionState<ActionResult<null> | null, FormData>(
    addCommentAction,
    null
  );
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) formRef.current?.reset();
  }, [state]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (!isSignedIn) {
      e.preventDefault();
      clerk.openSignIn();
    }
  }

  return (
    <form ref={formRef} action={formAction} onSubmit={handleSubmit} className="flex flex-col gap-2">
      <input type="hidden" name="projectId" value={projectId} />
      <input type="hidden" name="slug" value={slug} />
      {parentId && <input type="hidden" name="parentId" value={parentId} />}
      <textarea
        name="content"
        required
        rows={2}
        placeholder={placeholder}
        className="rounded-md border border-input px-3 py-2 text-sm"
      />
      {state && !state.success && <p className="text-xs text-destructive">{state.error}</p>}
      <button
        type="submit"
        disabled={pending}
        className="self-start rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {pending ? "Posting…" : "Post"}
      </button>
    </form>
  );
}
