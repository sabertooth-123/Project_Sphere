"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getUserByClerkId } from "@/services/users";
import { toggleLike, toggleBookmark } from "@/services/engagement";

export async function toggleLikeAction(projectId: string, slug: string) {
  const { userId: clerkId } = await auth.protect();
  const user = await getUserByClerkId(clerkId);
  if (!user) throw new Error("Could not find your account.");

  const result = await toggleLike(user.id, projectId);
  revalidatePath(`/projects/${slug}`);
  return result;
}

export async function toggleBookmarkAction(projectId: string, slug: string) {
  const { userId: clerkId } = await auth.protect();
  const user = await getUserByClerkId(clerkId);
  if (!user) throw new Error("Could not find your account.");

  const result = await toggleBookmark(user.id, projectId);
  revalidatePath(`/projects/${slug}`);
  return result;
}
