import { prisma } from "@/lib/prisma";

export function listComments(projectId: string) {
  return prisma.comment.findMany({
    where: { projectId, parentId: null },
    include: {
      user: true,
      replies: { include: { user: true }, orderBy: { createdAt: "asc" } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export function createComment(
  userId: string,
  projectId: string,
  content: string,
  parentId?: string
) {
  return prisma.comment.create({ data: { userId, projectId, content, parentId } });
}

export function deleteComment(commentId: string, userId: string) {
  return prisma.comment.deleteMany({ where: { id: commentId, userId } });
}
