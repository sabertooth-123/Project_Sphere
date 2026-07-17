"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getUserByClerkId, updateUserProfile } from "@/services/users";
import { profileFormSchema } from "./schema";
import type { ActionResult } from "@/types/api";

export async function updateProfileAction(
  _prev: ActionResult<null> | null,
  formData: FormData
): Promise<ActionResult<null>> {
  const { userId: clerkId } = await auth.protect();
  const user = await getUserByClerkId(clerkId);
  if (!user) {
    return { success: false, error: "Could not find your account." };
  }

  const parsed = profileFormSchema.safeParse({
    username: formData.get("username"),
    name: formData.get("name"),
    headline: formData.get("headline") || undefined,
    bio: formData.get("bio") || undefined,
    departmentId: formData.get("departmentId") || undefined,
    githubUrl: formData.get("githubUrl") ?? "",
    linkedinUrl: formData.get("linkedinUrl") ?? "",
    portfolioUrl: formData.get("portfolioUrl") ?? "",
    skills: formData.get("skills") || undefined,
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { username, skills, ...rest } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing && existing.id !== user.id) {
    return {
      success: false,
      error: "That username is already taken.",
      fieldErrors: { username: ["Already taken"] },
    };
  }

  const skillNames = (skills ?? "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  await updateUserProfile(user.id, { username, skillNames, ...rest });
  revalidatePath("/dashboard/settings");
  revalidatePath(`/u/${username}`);
  return { success: true, data: null };
}
