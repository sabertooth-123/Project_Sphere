"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/utils/slugify";
import { getOrCreateCurrentUser } from "@/lib/getCurrentUser";
import { onboardingSchema } from "./schema";
import type { ActionResult } from "@/types/api";

export async function completeOnboarding(
  _prev: ActionResult<null> | null,
  formData: FormData
): Promise<ActionResult<null>> {
  await auth.protect();
  const currentRow = await getOrCreateCurrentUser();
  if (!currentRow) {
    return { success: false, error: "Could not find your account. Try refreshing." };
  }
  const userId = currentRow.clerkId;

  const parsed = onboardingSchema.safeParse({
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

  const { username, name, headline, bio, departmentId, githubUrl, linkedinUrl, portfolioUrl, skills } =
    parsed.data;

  const existing = await prisma.user.findUnique({ where: { username } });
  if (existing && existing.clerkId !== userId) {
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

  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { clerkId: userId },
      data: {
        username,
        name,
        headline,
        bio,
        departmentId: departmentId || null,
        githubUrl,
        linkedinUrl,
        portfolioUrl,
        onboardingCompletedAt: new Date(),
      },
    });

    if (skillNames.length > 0) {
      const user = await tx.user.findUniqueOrThrow({ where: { clerkId: userId } });
      await tx.userSkill.deleteMany({ where: { userId: user.id } });

      for (const skillName of skillNames) {
        const slug = slugify(skillName);
        const technology = await tx.technology.upsert({
          where: { slug },
          update: {},
          create: { name: skillName, slug },
        });
        await tx.userSkill.create({
          data: { userId: user.id, technologyId: technology.id },
        });
      }
    }
  });

  redirect("/dashboard");
}
