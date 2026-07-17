import { clerkMiddleware } from "@clerk/nextjs/server";

// Establishes Clerk's auth context for every request. Route protection itself
// happens per-resource (auth.protect() in each protected page/action/route
// handler) rather than here — Clerk's own guidance as of the SDK version this
// project uses: middleware-based path matching can diverge from how Next.js
// actually routes requests, so it's no longer the source of truth for auth.
export default clerkMiddleware();

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
