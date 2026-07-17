import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getProjectBySlug, isProjectOwner } from "@/services/projects";
import { getOrCreateCurrentUser } from "@/lib/getCurrentUser";
import { listCategories } from "@/services/taxonomy";
import { ProjectForm } from "@/features/projects/components/ProjectForm";
import { updateProjectAction } from "@/features/projects/actions";

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  await auth.protect();
  const user = await getOrCreateCurrentUser();
  if (!user) redirect("/");

  const project = await getProjectBySlug(slug);
  if (!project) notFound();
  if (!(await isProjectOwner(project.id, user.id))) notFound();

  const categories = await listCategories();
  const boundAction = updateProjectAction.bind(null, project.id, project.slug);

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-2xl font-bold mb-2">Edit project</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Publish status is managed from your dashboard, not here.
      </p>
      <ProjectForm
        categories={categories}
        action={boundAction}
        defaults={{
          title: project.title,
          shortDescription: project.shortDescription,
          longDescription: project.longDescription,
          coverImageUrl: project.coverImageUrl ?? undefined,
          demoVideoUrl: project.demoVideoUrl ?? undefined,
          githubUrl: project.githubUrl ?? undefined,
          liveUrl: project.liveUrl ?? undefined,
          documentationUrl: project.documentationUrl ?? undefined,
          technologies: project.technologies.map((t) => t.technology.name).join(", "),
          tags: project.tags.map((t) => t.tag.name).join(", "),
          categoryIds: project.categories.map((c) => c.categoryId),
        }}
      />
    </main>
  );
}
