import { verifyWebhook } from "@clerk/nextjs/webhooks";
import type { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/utils/slugify";

export async function POST(request: NextRequest) {
  let event;
  try {
    event = await verifyWebhook(request);
  } catch {
    return new Response("Invalid webhook signature", { status: 400 });
  }

  switch (event.type) {
    case "user.created": {
      const user = event.data;
      const primaryEmail = user.email_addresses.find(
        (email) => email.id === user.primary_email_address_id
      );
      if (!primaryEmail) {
        return new Response("User has no primary email", { status: 400 });
      }

      // Clerk's own username is often null for OAuth-only sign-ups (e.g. Google).
      // Generate a temporary, guaranteed-unique one; onboarding lets the user pick their own.
      const usernameBase = slugify(
        user.username ?? primaryEmail.email_address.split("@")[0]
      );
      const username = `${usernameBase}-${user.id.slice(-6)}`;

      await prisma.user.create({
        data: {
          clerkId: user.id,
          username,
          name: [user.first_name, user.last_name].filter(Boolean).join(" ") || username,
          email: primaryEmail.email_address,
          avatarUrl: user.image_url,
        },
      });
      break;
    }

    case "user.updated": {
      const user = event.data;
      const primaryEmail = user.email_addresses.find(
        (email) => email.id === user.primary_email_address_id
      );

      await prisma.user.updateMany({
        where: { clerkId: user.id },
        data: {
          name: [user.first_name, user.last_name].filter(Boolean).join(" ") || undefined,
          email: primaryEmail?.email_address,
          avatarUrl: user.image_url,
        },
      });
      break;
    }

    case "user.deleted": {
      if (event.data.id) {
        await prisma.user.deleteMany({ where: { clerkId: event.data.id } });
      }
      break;
    }
  }

  return new Response("OK", { status: 200 });
}
