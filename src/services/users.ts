import { prisma } from "@/lib/prisma";
import { slugify } from "@/utils/slugify";

export function getUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({ where: { clerkId } });
}

export function getUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username },
    include: { department: true, skills: { include: { technology: true } } },
  });
}

export type ProfileUpdateData = {
  username: string;
  name: string;
  headline?: string;
  bio?: string;
  departmentId?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  skillNames: string[];
};

export async function updateUserProfile(userId: string, data: ProfileUpdateData) {
  await prisma.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: {
        username: data.username,
        name: data.name,
        headline: data.headline,
        bio: data.bio,
        departmentId: data.departmentId || null,
        githubUrl: data.githubUrl,
        linkedinUrl: data.linkedinUrl,
        portfolioUrl: data.portfolioUrl,
      },
    });

    await tx.userSkill.deleteMany({ where: { userId } });

    for (const name of data.skillNames) {
      const slug = slugify(name);
      const technology = await tx.technology.upsert({
        where: { slug },
        update: {},
        create: { name, slug },
      });
      await tx.userSkill.create({ data: { userId, technologyId: technology.id } });
    }
  });
}
