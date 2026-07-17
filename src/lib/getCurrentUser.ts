import { currentUser } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getUserByClerkId } from "@/services/users";
import { slugify } from "@/utils/slugify";

/**
 * Returns the signed-in user's row, creating it on the spot if the Clerk
 * webhook hasn't (yet, or ever) synced it. The webhook is the primary path,
 * but it can lag, fail, or simply not be registered — this keeps every
 * authenticated page/action working regardless of webhook health.
 */
export async function getOrCreateCurrentUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;

  const existing = await getUserByClerkId(clerkUser.id);
  if (existing) return existing;

  const primaryEmail = clerkUser.emailAddresses.find(
    (e) => e.id === clerkUser.primaryEmailAddressId
  );
  if (!primaryEmail) return null;

  const usernameBase = slugify(clerkUser.username ?? primaryEmail.emailAddress.split("@")[0]);
  const username = `${usernameBase}-${clerkUser.id.slice(-6)}`;

  return prisma.user.create({
    data: {
      clerkId: clerkUser.id,
      username,
      name: [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || username,
      email: primaryEmail.emailAddress,
      avatarUrl: clerkUser.imageUrl,
    },
  });
}
