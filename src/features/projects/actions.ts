"use server";

import { z } from "zod";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getOrCreateCurrentUser } from "@/lib/getCurrentUser";
import {
  createProject,
  isProjectOwner,
  publishProject,
  unpublishProject,
  deleteProject,
} from "@/services/projects";
import { addContributor, removeContributor } from "@/services/contributors";
import { projectFormSchema } from "./schema";
import type { ActionResult } from "@/types/api";

export async function createProjectAction(
  _prev: ActionResult<null> | null,
  formData: FormData
): Promise<ActionResult<null>> {
  await auth.protect();
  const user = await getOrCreateCurrentUser();
  if (!user) {
    return { success: false, error: "Could not find your account. Try refreshing." };
  }

  const parsed = projectFormSchema.safeParse({
    title: formData.get("title"),
    shortDescription: formData.get("shortDescription"),
    longDescription: formData.get("longDescription"),
    coverImageUrl: formData.get("coverImageUrl") ?? "",
    demoVideoUrl: formData.get("demoVideoUrl") ?? "",
    githubUrl: formData.get("githubUrl") ?? "",
    liveUrl: formData.get("liveUrl") ?? "",
    documentationUrl: formData.get("documentationUrl") ?? "",
    technologies: formData.get("technologies") ?? "",
    tags: formData.get("tags") ?? "",
    categoryIds: formData.getAll("categoryIds"),
    publish: formData.get("publish") === "publish" ? "publish" : "draft",
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const project = await createProject(user.id, {
    ...parsed.data,
    publish: parsed.data.publish === "publish",
  });

  redirect(`/projects/${project.slug}`);
}

const addContributorSchema = z.object({
  username: z.string().optional(),
  externalName: z.string().optional(),
  role: z.enum(["CONTRIBUTOR", "MENTOR"]),
});

export async function addContributorAction(
  projectId: string,
  slug: string,
  _prev: ActionResult<null> | null,
  formData: FormData
): Promise<ActionResult<null>> {
  await auth.protect();
  const user = await getOrCreateCurrentUser();
  if (!user || !(await isProjectOwner(projectId, user.id))) {
    return { success: false, error: "Only the project owner can add contributors." };
  }

  const parsed = addContributorSchema.safeParse({
    username: formData.get("username") || undefined,
    externalName: formData.get("externalName") || undefined,
    role: formData.get("role") || "CONTRIBUTOR",
  });

  if (!parsed.success || (!parsed.data.username && !parsed.data.externalName)) {
    return { success: false, error: "Provide a username or an external contributor name." };
  }

  try {
    await addContributor(projectId, parsed.data);
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Could not add contributor." };
  }

  revalidatePath(`/projects/${slug}`);
  return { success: true, data: null };
}

export async function removeContributorAction(contributorId: string, projectId: string, slug: string) {
  await auth.protect();
  const user = await getOrCreateCurrentUser();
  if (!user || !(await isProjectOwner(projectId, user.id))) {
    throw new Error("Only the project owner can remove contributors.");
  }

  await removeContributor(contributorId);
  revalidatePath(`/projects/${slug}`);
}

async function assertOwner(projectId: string) {
  await auth.protect();
  const user = await getOrCreateCurrentUser();
  if (!user || !(await isProjectOwner(projectId, user.id))) {
    throw new Error("Only the project owner can do that.");
  }
}

export async function publishProjectAction(projectId: string, slug: string) {
  await assertOwner(projectId);
  await publishProject(projectId);
  revalidatePath(`/projects/${slug}`);
  revalidatePath("/dashboard/projects");
}

export async function unpublishProjectAction(projectId: string, slug: string) {
  await assertOwner(projectId);
  await unpublishProject(projectId);
  revalidatePath(`/projects/${slug}`);
  revalidatePath("/dashboard/projects");
}

export async function deleteProjectAction(projectId: string) {
  await assertOwner(projectId);
  await deleteProject(projectId);
  revalidatePath("/dashboard/projects");
}
