"use server";

import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getOrCreateCurrentUser } from "@/lib/getCurrentUser";
import {
  createCollection,
  deleteCollection,
  addProjectToCollection,
  removeProjectFromCollection,
  isCollectionOwner,
} from "@/services/collections";
import { collectionFormSchema } from "./schema";
import type { ActionResult } from "@/types/api";

export async function createCollectionAction(
  _prev: ActionResult<null> | null,
  formData: FormData
): Promise<ActionResult<null>> {
  await auth.protect();
  const user = await getOrCreateCurrentUser();
  if (!user) {
    return { success: false, error: "Could not find your account." };
  }

  const parsed = collectionFormSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
    isPublic: formData.get("isPublic") === "on",
  });

  if (!parsed.success) {
    return {
      success: false,
      error: "Please fix the highlighted fields.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const collection = await createCollection(user.id, parsed.data);
  revalidatePath("/dashboard/collections");
  redirect(`/dashboard/collections/${collection.id}`);
}

async function assertCollectionOwner(collectionId: string) {
  await auth.protect();
  const user = await getOrCreateCurrentUser();
  if (!user || !(await isCollectionOwner(collectionId, user.id))) {
    throw new Error("Only the collection owner can do that.");
  }
}

export async function addProjectToCollectionAction(collectionId: string, projectId: string) {
  await assertCollectionOwner(collectionId);
  await addProjectToCollection(collectionId, projectId);
  revalidatePath(`/dashboard/collections/${collectionId}`);
}

export async function removeProjectFromCollectionAction(collectionId: string, projectId: string) {
  await assertCollectionOwner(collectionId);
  await removeProjectFromCollection(collectionId, projectId);
  revalidatePath(`/dashboard/collections/${collectionId}`);
}

export async function deleteCollectionAction(collectionId: string) {
  await assertCollectionOwner(collectionId);
  await deleteCollection(collectionId);
  revalidatePath("/dashboard/collections");
  redirect("/dashboard/collections");
}
