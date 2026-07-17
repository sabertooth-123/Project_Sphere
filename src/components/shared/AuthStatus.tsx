"use client";

import Link from "next/link";
import { useAuth, SignInButton, UserButton } from "@clerk/nextjs";

export function AuthStatus() {
  const { isLoaded, isSignedIn } = useAuth();

  if (!isLoaded) return null;

  if (!isSignedIn) {
    return (
      <SignInButton>
        <button className="rounded-md bg-primary text-primary-foreground px-4 py-2 text-sm font-medium">
          Sign in
        </button>
      </SignInButton>
    );
  }

  return (
    <div className="flex items-center gap-4">
      <Link
        href="/projects/new"
        className="rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground"
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
