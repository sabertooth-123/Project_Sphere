import { prisma } from "@/lib/prisma";
import type { ContributorRole } from "@/generated/prisma/client";

export async function addContributor(
  projectId: string,
  input: { username?: string; externalName?: string; role: ContributorRole }
) {
  if (input.username) {
    const user = await prisma.user.findUnique({ where: { username: input.username } });
    if (!user) throw new Error(`No user found with username "${input.username}"`);
    return prisma.projectContributor.create({
      data: { projectId, userId: user.id, role: input.role },
    });
  }

  if (input.externalName) {
    return prisma.projectContributor.create({
      data: { projectId, externalName: input.externalName, role: input.role },
    });
  }

  throw new Error("Provide either a username or an external contributor name.");
}

export function removeContributor(contributorId: string, projectId: string) {
  return prisma.projectContributor.deleteMany({ where: { id: contributorId, projectId } });
}
