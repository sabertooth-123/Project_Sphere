"use client";

import Link from "next/link";
import { useAuth, SignInButton } from "@clerk/nextjs";
import { MotionButton } from "@/components/ui/MotionButton";

const linkButtonClass =
  "rounded-md px-5 py-2.5 text-sm font-medium transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95";

export function HomeCTA() {
  const { isLoaded, isSignedIn } = useAuth();

  return (
    <div className="flex flex-wrap justify-center gap-3">
      {!isLoaded ? (
        <div className="h-10 w-40 rounded-md bg-muted" />
      ) : isSignedIn ? (
        <Link href="/projects/new" className={`${linkButtonClass} bg-primary text-primary-foreground`}>
          Publish a project
        </Link>
      ) : (
        <SignInButton>
          <MotionButton className="px-5 py-2.5">Sign in to get started</MotionButton>
        </SignInButton>
      )}
      <Link
        href="/explore"
        className={`${linkButtonClass} border border-input hover:bg-accent`}
      >
        Explore projects
      </Link>
    </div>
  );
}
