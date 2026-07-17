"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { getOrCreateCurrentUser } from "@/lib/getCurrentUser";
import { toggleLike, toggleBookmark } from "@/services/engagement";

export async function toggleLikeAction(projectId: string, slug: string) {
  await auth.protect();
  const user = await getOrCreateCurrentUser();
  if (!user) throw new Error("Could not find your account.");

  const result = await toggleLike(user.id, projectId);
  revalidatePath(`/projects/${slug}`);
  return result;
}

export async function toggleBookmarkAction(projectId: string, slug: string) {
  await auth.protect();
  const user = await getOrCreateCurrentUser();
  if (!user) throw new Error("Could not find your account.");

  const result = await toggleBookmark(user.id, projectId);
  revalidatePath(`/projects/${slug}`);
  return result;
}
