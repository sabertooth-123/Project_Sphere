import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getOrCreateCurrentUser } from "@/lib/getCurrentUser";
import { getCollectionById, isCollectionOwner } from "@/services/collections";
import { listBookmarkedProjects } from "@/services/engagement";
import { deleteCollectionAction } from "@/features/collections/actions";
import { CollectionItemRow } from "@/features/collections/components/CollectionItemRow";
import { AddProjectToCollection } from "@/features/collections/components/AddProjectToCollection";

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await auth.protect();
  const user = await getOrCreateCurrentUser();
  if (!user) redirect("/");

  const collection = await getCollectionById(id);
  if (!collection) notFound();
  if (!(await isCollectionOwner(id, user.id))) notFound();

  const bookmarks = await listBookmarkedProjects(user.id);
  const alreadyInCollection = new Set(collection.items.map((i) => i.projectId));
  const addableOptions = bookmarks
    .filter((p) => !alreadyInCollection.has(p.id))
    .map((p) => ({ id: p.id, title: p.title }));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold">{collection.name}</h1>
          {collection.description && (
            <p className="text-sm text-muted-foreground">{collection.description}</p>
          )}
        </div>
        <form action={deleteCollectionAction.bind(null, collection.id)}>
          <button type="submit" className="text-xs text-destructive underline">
            Delete collection
          </button>
        </form>
      </div>

      <div className="mb-6">
        <AddProjectToCollection collectionId={collection.id} options={addableOptions} />
      </div>

      {collection.items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No projects in this collection yet.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {collection.items.map((item) => (
            <CollectionItemRow key={item.projectId} collectionId={collection.id} project={item.project} />
          ))}
        </ul>
      )}
    </div>
  );
}
