import Link from "next/link";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { AuthStatus } from "@/components/shared/AuthStatus";
import { StickyHeaderShell } from "@/components/layout/StickyHeaderShell";

export function Navbar() {
  return (
    <StickyHeaderShell>
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
    </StickyHeaderShell>
  );
}
