import { createHash } from "crypto";
import type { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { getProjectBySlug } from "@/services/projects";
import { getUserByClerkId } from "@/services/users";
import { recordView } from "@/services/engagement";

export async function POST(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    return new Response(null, { status: 404 });
  }

  const { userId: clerkId } = await auth();
  const user = clerkId ? await getUserByClerkId(clerkId) : null;

  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const ua = request.headers.get("user-agent") ?? "unknown";
  const day = new Date().toISOString().slice(0, 10);
  const sessionHash = createHash("sha256").update(`${ip}-${ua}-${day}`).digest("hex");

  await recordView(project.id, { userId: user?.id, sessionHash });

  return new Response(null, { status: 204 });
}
