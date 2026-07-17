import { prisma } from "@/lib/prisma";

export function listUserCollections(userId: string) {
  return prisma.collection.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { items: true },
  });
}

export function getCollectionById(id: string) {
  return prisma.collection.findUnique({
    where: { id },
    include: {
      items: { include: { project: true }, orderBy: { addedAt: "desc" } },
    },
  });
}

export function createCollection(
  userId: string,
  data: { name: string; description?: string; isPublic: boolean }
) {
  return prisma.collection.create({ data: { userId, ...data } });
}

export function deleteCollection(id: string) {
  return prisma.collection.delete({ where: { id } });
}

export function addProjectToCollection(collectionId: string, projectId: string) {
  return prisma.collectionItem.upsert({
    where: { collectionId_projectId: { collectionId, projectId } },
    update: {},
    create: { collectionId, projectId },
  });
}

export function removeProjectFromCollection(collectionId: string, projectId: string) {
  return prisma.collectionItem.delete({
    where: { collectionId_projectId: { collectionId, projectId } },
  });
}

export async function isCollectionOwner(collectionId: string, userId: string) {
  const collection = await prisma.collection.findUnique({ where: { id: collectionId } });
  return collection?.userId === userId;
}
