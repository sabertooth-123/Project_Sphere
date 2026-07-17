"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getOrCreateCurrentUser } from "@/lib/getCurrentUser";
import { createComment, deleteComment } from "@/services/comments";
import type { ActionResult } from "@/types/api";

const commentSchema = z.object({
  content: z.string().min(1, "Comment can't be empty").max(2000),
  projectId: z.string(),
  slug: z.string(),
  parentId: z.string().optional(),
});

export async function addCommentAction(
  _prev: ActionResult<null> | null,
  formData: FormData
): Promise<ActionResult<null>> {
  await auth.protect();
  const user = await getOrCreateCurrentUser();
  if (!user) {
    return { success: false, error: "Could not find your account." };
  }

  const parsed = commentSchema.safeParse({
    content: formData.get("content"),
    projectId: formData.get("projectId"),
    slug: formData.get("slug"),
    parentId: formData.get("parentId") || undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Comment can't be empty.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  await createComment(user.id, parsed.data.projectId, parsed.data.content, parsed.data.parentId);
  revalidatePath(`/projects/${parsed.data.slug}`);
  return { success: true, data: null };
}

export async function deleteCommentAction(commentId: string, slug: string) {
  await auth.protect();
  const user = await getOrCreateCurrentUser();
  if (!user) throw new Error("Could not find your account.");

  await deleteComment(commentId, user.id);
  revalidatePath(`/projects/${slug}`);
}
