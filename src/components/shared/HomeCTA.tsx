"use client";

import Link from "next/link";
import { useAuth, SignInButton } from "@clerk/nextjs";

export function HomeCTA() {
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {!isLoaded ? (
        <div className="h-10 w-40 rounded-md bg-muted" />
      ) : isSignedIn ? (
        <Link
          href="/projects/new"
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground"
        >
          Publish a project
        </Link>
      ) : (
        <SignInButton>
          <button className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground">
            Sign in to get started
          </button>
        </SignInButton>
      )}
      <Link
        href="/explore"
        className="rounded-md border border-input px-5 py-2.5 text-sm font-medium hover:bg-accent"
      >
        Explore projects
      </Link>
    </div>
  );
}
