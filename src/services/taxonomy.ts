import { prisma } from "@/lib/prisma";

export function listDepartments() {
  return prisma.department.findMany({ orderBy: { name: "asc" } });
}

export function listCategories() {
  return prisma.category.findMany({ orderBy: { name: "asc" } });
}

export function listTechnologies() {
  return prisma.technology.findMany({ orderBy: { name: "asc" } });
}

export function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export function getTechnologyBySlug(slug: string) {
  return prisma.technology.findUnique({ where: { slug } });
}

export function getDepartmentBySlug(slug: string) {
  return prisma.department.findUnique({ where: { slug } });
}
