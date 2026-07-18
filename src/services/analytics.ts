import { prisma } from "@/lib/prisma";

export type DailyViewCount = { date: string; count: number };

export type ProjectAnalyticsRow = {
  id: string;
  slug: string;
  title: string;
  status: string;
  viewCount: number;
  likeCount: number;
  bookmarkCount: number;
};

export type OwnerAnalytics = {
  totals: {
    projects: number;
    views: number;
    likes: number;
    bookmarks: number;
  };
  projects: ProjectAnalyticsRow[];
  viewsByDay: DailyViewCount[];
};

const TREND_DAYS = 14;

export async function getOwnerAnalytics(ownerUserId: string): Promise<OwnerAnalytics> {
  const projects = await prisma.project.findMany({
    where: { contributors: { some: { userId: ownerUserId, role: "OWNER" } } },
    select: {
      id: true,
      slug: true,
      title: true,
      status: true,
      viewCount: true,
      likeCount: true,
      bookmarkCount: true,
    },
    orderBy: { viewCount: "desc" },
  });

  const totals = projects.reduce(
    (acc, p) => {
      acc.views += p.viewCount;
      acc.likes += p.likeCount;
      acc.bookmarks += p.bookmarkCount;
      return acc;
    },
    { views: 0, likes: 0, bookmarks: 0 }
  );

  const since = new Date();
  since.setDate(since.getDate() - (TREND_DAYS - 1));
  since.setHours(0, 0, 0, 0);

  const projectIds = projects.map((p) => p.id);
  const views =
    projectIds.length > 0
      ? await prisma.projectView.findMany({
          where: { projectId: { in: projectIds }, viewedAt: { gte: since } },
          select: { viewedAt: true },
        })
      : [];

  const byDay = new Map<string, number>();
  for (let i = 0; i < TREND_DAYS; i++) {
    const d = new Date(since);
    d.setDate(d.getDate() + i);
    byDay.set(d.toISOString().slice(0, 10), 0);
  }
  for (const v of views) {
    const key = v.viewedAt.toISOString().slice(0, 10);
    if (byDay.has(key)) byDay.set(key, (byDay.get(key) ?? 0) + 1);
  }

  return {
    totals: { projects: projects.length, ...totals },
    projects,
    viewsByDay: Array.from(byDay.entries()).map(([date, count]) => ({ date, count })),
  };
}
