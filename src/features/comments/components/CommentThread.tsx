import { listComments } from "@/services/comments";
import { CommentForm } from "./CommentForm";
import { CommentItem } from "./CommentItem";

export async function CommentThread({
  projectId,
  slug,
  currentUserId,
}: {
  projectId: string;
  slug: string;
  currentUserId: string | null;
}) {
  const comments = await listComments(projectId);

  return (
    <div className="flex flex-col gap-6">
      <CommentForm projectId={projectId} slug={slug} />

      {comments.length === 0 ? (
        <p className="text-sm text-muted-foreground">No comments yet — be the first.</p>
      ) : (
        <div className="flex flex-col gap-6">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              projectId={projectId}
              slug={slug}
              currentUserId={currentUserId}
            />
          ))}
        </div>
      )}
    </div>
  );
}
