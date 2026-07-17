"use client";

import { useOptimistic, useTransition } from "react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { toggleBookmarkAction } from "../actions";

export function BookmarkButton({
  projectId,
  slug,
  initialBookmarked,
}: {
  projectId: string;
  slug: string;
  initialBookmarked: boolean;
}) {
  const { isSignedIn } = useAuth();
  const clerk = useClerk();
  const [isPending, startTransition] = useTransition();
  const [bookmarked, setOptimisticBookmarked] = useOptimistic(
    initialBookmarked,
    (_current, next: boolean) => next
  );

  function handleClick() {
    if (!isSignedIn) {
      clerk.openSignIn();
      return;
    }
    startTransition(async () => {
      setOptimisticBookmarked(!bookmarked);
      await toggleBookmarkAction(projectId, slug);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
        bookmarked
          ? "border-primary bg-primary/10 text-primary"
          : "border-input text-foreground hover:bg-accent"
      }`}
    >
      {bookmarked ? "⚑ Saved" : "⚐ Save"}
    </button>
  );
}
