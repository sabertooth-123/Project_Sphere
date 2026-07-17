"use client";

import { useState, useTransition } from "react";
import { deleteCommentAction } from "../actions";
import { CommentForm } from "./CommentForm";

type CommentUser = { id: string; name: string; username: string };
type CommentData = {
  id: string;
  content: string;
  createdAt: Date | string;
  user: CommentUser;
  replies?: { id: string; content: string; createdAt: Date | string; user: CommentUser }[];
};

export function CommentItem({
  comment,
  projectId,
  slug,
  currentUserId,
  allowReply = true,
}: {
  comment: CommentData;
  projectId: string;
  slug: string;
  currentUserId: string | null;
  allowReply?: boolean;
}) {
  const [showReply, setShowReply] = useState(false);
  const [isPending, startTransition] = useTransition();

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-baseline gap-2">
        <span className="font-medium text-sm">{comment.user.name}</span>
        <span className="text-xs text-muted-foreground">@{comment.user.username}</span>
      </div>
      <p className="text-sm">{comment.content}</p>
      <div className="flex gap-3 text-xs text-muted-foreground">
        {allowReply && (
          <button type="button" onClick={() => setShowReply((s) => !s)} className="underline">
            Reply
          </button>
        )}
        {currentUserId === comment.user.id && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => startTransition(() => deleteCommentAction(comment.id, slug))}
            className="underline"
          >
            Delete
          </button>
        )}
      </div>

      {showReply && (
        <div className="mt-2 ml-4">
          <CommentForm
            projectId={projectId}
            slug={slug}
            parentId={comment.id}
            placeholder="Write a reply…"
          />
        </div>
      )}

      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-3 ml-4 flex flex-col gap-4 border-l border-border pl-4">
          {comment.replies.map((reply) => (
            <CommentItem
              key={reply.id}
              comment={reply}
              projectId={projectId}
              slug={slug}
              currentUserId={currentUserId}
              allowReply={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
