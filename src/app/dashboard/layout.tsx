import Link from "next/link";

const TABS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/analytics", label: "Analytics" },
  { href: "/dashboard/projects", label: "Projects" },
  { href: "/dashboard/bookmarks", label: "Bookmarks" },
  { href: "/dashboard/collections", label: "Collections" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <nav className="mb-8 flex gap-4 border-b border-border pb-3 text-sm">
        {TABS.map((tab) => (
          <Link key={tab.href} href={tab.href} className="text-muted-foreground hover:text-foreground">
            {tab.label}
          </Link>
        ))}
      </nav>
      {children}
    </div>
  );
}
