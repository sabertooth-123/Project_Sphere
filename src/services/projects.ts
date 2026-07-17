import { prisma } from "@/lib/prisma";
import { slugify } from "@/utils/slugify";
import type { Prisma } from "@/generated/prisma/client";

export type ListProjectsFilters = {
  q?: string;
  categorySlug?: string;
  technologySlugs?: string[];
  departmentSlug?: string;
  sort?: "trending" | "recent" | "most-liked";
  cursor?: string;
  limit?: number;
};

export async function listProjects(filters: ListProjectsFilters = {}) {
  const { q, categorySlug, technologySlugs, departmentSlug, sort = "recent", cursor, limit = 20 } = filters;

  const where: Prisma.ProjectWhereInput = {
    status: "PUBLISHED",
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: "insensitive" } },
            { shortDescription: { contains: q, mode: "insensitive" } },
          ],
        }
      : {}),
    ...(categorySlug ? { categories: { some: { category: { slug: categorySlug } } } } : {}),
    ...(technologySlugs && technologySlugs.length > 0
      ? { technologies: { some: { technology: { slug: { in: technologySlugs } } } } }
      : {}),
    ...(departmentSlug
      ? { contributors: { some: { user: { department: { slug: departmentSlug } } } } }
      : {}),
  };

  const orderBy: Prisma.ProjectOrderByWithRelationInput[] =
    sort === "most-liked"
      ? [{ likeCount: "desc" }, { id: "desc" }]
      : sort === "trending"
        ? [{ likeCount: "desc" }, { viewCount: "desc" }, { id: "desc" }]
        : [{ publishedAt: "desc" }, { id: "desc" }];

  return prisma.project.findMany({
    where,
    orderBy,
    take: limit,
    ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
  });
}

const projectDetailInclude = {
  images: { orderBy: { order: "asc" as const } },
  contributors: { include: { user: true }, orderBy: { joinedAt: "asc" as const } },
  technologies: { include: { technology: true } },
  categories: { include: { category: true } },
  tags: { include: { tag: true } },
  timeline: { orderBy: { order: "asc" as const } },
  awards: true,
};

export function getProjectBySlug(slug: string) {
  return prisma.project.findUnique({
    where: { slug },
    include: projectDetailInclude,
  });
}

export function listProjectsByOwner(
  ownerUserId: string,
  opts: { publishedOnly?: boolean } = {}
) {
  return prisma.project.findMany({
    where: {
      contributors: { some: { userId: ownerUserId, role: "OWNER" } },
      ...(opts.publishedOnly ? { status: "PUBLISHED" } : {}),
    },
    orderBy: { createdAt: "desc" },
  });
}

async function uniqueSlug(title: string): Promise<string> {
  const base = slugify(title);
  const existing = await prisma.project.findUnique({ where: { slug: base } });
  if (!existing) return base;
  return `${base}-${Math.random().toString(36).slice(2, 7)}`;
}

export type ProjectFormData = {
  title: string;
  shortDescription: string;
  longDescription: string;
  coverImageUrl?: string;
  demoVideoUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  documentationUrl?: string;
  technologies: string[];
  tags: string[];
  categoryIds: string[];
  publish: boolean;
};

export async function createProject(ownerUserId: string, data: ProjectFormData) {
  const slug = await uniqueSlug(data.title);
  const now = new Date();

  return prisma.$transaction(async (tx) => {
    const project = await tx.project.create({
      data: {
        slug,
        title: data.title,
        shortDescription: data.shortDescription,
        longDescription: data.longDescription,
        coverImageUrl: data.coverImageUrl || null,
        demoVideoUrl: data.demoVideoUrl || null,
        githubUrl: data.githubUrl || null,
        liveUrl: data.liveUrl || null,
        documentationUrl: data.documentationUrl || null,
        status: data.publish ? "PUBLISHED" : "DRAFT",
        publishedAt: data.publish ? now : null,
      },
    });

    await tx.projectContributor.create({
      data: { projectId: project.id, userId: ownerUserId, role: "OWNER" },
    });

    for (const name of data.technologies) {
      const techSlug = slugify(name);
      const technology = await tx.technology.upsert({
        where: { slug: techSlug },
        update: {},
        create: { name, slug: techSlug },
      });
      await tx.projectTechnology.create({
        data: { projectId: project.id, technologyId: technology.id },
      });
    }

    for (const name of data.tags) {
      const tagSlug = slugify(name);
      const tag = await tx.tag.upsert({
        where: { slug: tagSlug },
        update: {},
        create: { name, slug: tagSlug },
      });
      await tx.projectTag.create({ data: { projectId: project.id, tagId: tag.id } });
    }

    for (const categoryId of data.categoryIds) {
      await tx.projectCategory.create({ data: { projectId: project.id, categoryId } });
    }

    return project;
  });
}

export async function isProjectOwner(projectId: string, userId: string) {
  const contributor = await prisma.projectContributor.findFirst({
    where: { projectId, userId, role: "OWNER" },
  });
  return Boolean(contributor);
}

export function publishProject(projectId: string) {
  return prisma.project.update({
    where: { id: projectId },
    data: { status: "PUBLISHED", publishedAt: new Date() },
  });
}

export function unpublishProject(projectId: string) {
  return prisma.project.update({
    where: { id: projectId },
    data: { status: "DRAFT" },
  });
}

export function deleteProject(projectId: string) {
  return prisma.project.delete({ where: { id: projectId } });
}
