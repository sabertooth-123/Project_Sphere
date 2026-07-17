import { auth } from "@clerk/nextjs/server";
import { listCategories } from "@/services/taxonomy";
import { ProjectForm } from "@/features/projects/components/ProjectForm";

export default async function NewProjectPage() {
  await auth.protect();
  const categories = await listCategories();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-2xl font-bold mb-2">Publish a project</h1>
      <p className="text-sm text-muted-foreground mb-8">
        Fill in what you have — you can always edit this later.
      </p>
      <ProjectForm categories={categories} />
    </main>
  );
}
