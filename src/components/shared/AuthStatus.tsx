"use client";

import Link from "next/link";
import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";
import { MotionButton } from "@/components/ui/MotionButton";

export function AuthStatus() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <SignInButton>
        <MotionButton>Sign in</MotionButton>
      </SignInButton>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/projects/new"
        className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground transition-transform duration-150 ease-out hover:-translate-y-0.5 hover:scale-[1.02] active:scale-95"
      >
        New project
      </Link>
      <Link href="/dashboard" className="text-sm underline">
        Dashboard
      </Link>
      <UserButton />
    </div>
  );
}
