import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUserByClerkId } from "@/services/users";
import { listUserCollections } from "@/services/collections";
import { CollectionForm } from "@/features/collections/components/CollectionForm";

export default async function DashboardCollectionsPage() {
  const { userId } = await auth.protect();
  const user = await getUserByClerkId(userId);
  if (!user) redirect("/");

  const collections = await listUserCollections(user.id);

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="mb-6 font-display text-2xl font-bold">Collections</h1>
        {collections.length === 0 ? (
          <p className="mb-6 text-sm text-muted-foreground">
            No collections yet — group projects you want to revisit or share.
          </p>
        ) : (
          <ul className="mb-6 flex flex-col gap-3">
            {collections.map((c) => (
              <li key={c.id}>
                <Link
                  href={`/dashboard/collections/${c.id}`}
                  className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-accent"
                >
                  <div>
                    <p className="font-medium">{c.name}</p>
                    {c.description && (
                      <p className="text-sm text-muted-foreground">{c.description}</p>
                    )}
                  </div>
                  <span className="font-mono text-xs text-muted-foreground tabular-nums">
                    {c.items.length} project{c.items.length === 1 ? "" : "s"}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>

      <CollectionForm />
    </div>
  );
}
