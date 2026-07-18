import Link from "next/link";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { AuthStatus } from "@/components/shared/AuthStatus";

export function Navbar() {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-display text-lg font-semibold">
            Project Sphere
          </Link>
          <nav className="hidden items-center gap-4 text-sm text-muted-foreground sm:flex">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <Link href="/explore" className="hover:text-foreground">
              Explore
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <AuthStatus />
        </div>
      </div>
    </header>
  );
}
