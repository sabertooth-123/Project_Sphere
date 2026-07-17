"use client";

import { useOptimistic, useTransition } from "react";
import { useAuth, useClerk } from "@clerk/nextjs";
import { toggleLikeAction } from "../actions";

export function LikeButton({
  projectId,
  slug,
  initialLiked,
  initialCount,
}: {
  projectId: string;
  slug: string;
  initialLiked: boolean;
  initialCount: number;
}) {
  const { isSignedIn } = useAuth();
  const clerk = useClerk();
  const [isPending, startTransition] = useTransition();
  const [state, setOptimisticLiked] = useOptimistic(
    { liked: initialLiked, count: initialCount },
    (current, liked: boolean) => ({ liked, count: current.count + (liked ? 1 : -1) })
  );

  function handleClick() {
    if (!isSignedIn) {
      clerk.openSignIn();
      return;
    }
    startTransition(async () => {
      setOptimisticLiked(!state.liked);
      await toggleLikeAction(projectId, slug);
    });
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={isPending}
      className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium transition-colors ${
        state.liked
          ? "border-primary bg-primary/10 text-primary"
          : "border-input text-foreground hover:bg-accent"
      }`}
    >
      <span>{state.liked ? "♥" : "♡"}</span>
      <span className="font-mono tabular-nums">{state.count}</span>
    </button>
  );
}
