import { prisma } from "@/lib/prisma";

export async function toggleLike(userId: string, projectId: string) {
  const existing = await prisma.like.findUnique({
    where: { userId_projectId: { userId, projectId } },
  });

  if (existing) {
    await prisma.$transaction([
      prisma.like.delete({ where: { id: existing.id } }),
      prisma.project.update({ where: { id: projectId }, data: { likeCount: { decrement: 1 } } }),
    ]);
    return { liked: false };
  }

  await prisma.$transaction([
    prisma.like.create({ data: { userId, projectId } }),
    prisma.project.update({ where: { id: projectId }, data: { likeCount: { increment: 1 } } }),
  ]);
  return { liked: true };
}

export async function toggleBookmark(userId: string, projectId: string) {
  const existing = await prisma.bookmark.findUnique({
    where: { userId_projectId: { userId, projectId } },
  });

  if (existing) {
    await prisma.$transaction([
      prisma.bookmark.delete({ where: { id: existing.id } }),
      prisma.project.update({ where: { id: projectId }, data: { bookmarkCount: { decrement: 1 } } }),
    ]);
    return { bookmarked: false };
  }

  await prisma.$transaction([
    prisma.bookmark.create({ data: { userId, projectId } }),
    prisma.project.update({ where: { id: projectId }, data: { bookmarkCount: { increment: 1 } } }),
  ]);
  return { bookmarked: true };
}

export async function listBookmarkedProjects(userId: string) {
  const bookmarks = await prisma.bookmark.findMany({
    where: { userId },
    include: {
      project: { include: { technologies: { include: { technology: true }, take: 4 } } },
    },
    orderBy: { createdAt: "desc" },
  });
  return bookmarks.map((b) => b.project);
}

export async function getViewerEngagement(userId: string | null, projectId: string) {
  if (!userId) return { liked: false, bookmarked: false };
  const [like, bookmark] = await Promise.all([
    prisma.like.findUnique({ where: { userId_projectId: { userId, projectId } } }),
    prisma.bookmark.findUnique({ where: { userId_projectId: { userId, projectId } } }),
  ]);
  return { liked: Boolean(like), bookmarked: Boolean(bookmark) };
}

export async function recordView(
  projectId: string,
  opts: { userId?: string; sessionHash?: string }
) {
  // sessionHash already bakes in the day, so a duplicate row for the same
  // project+hash means "this visitor already counted today" — skip it.
  if (opts.sessionHash) {
    const alreadyCounted = await prisma.projectView.findFirst({
      where: { projectId, sessionHash: opts.sessionHash },
    });
    if (alreadyCounted) return;
  }

  await prisma.$transaction([
    prisma.projectView.create({
      data: { projectId, userId: opts.userId, sessionHash: opts.sessionHash },
    }),
    prisma.project.update({ where: { id: projectId }, data: { viewCount: { increment: 1 } } }),
  ]);
}
