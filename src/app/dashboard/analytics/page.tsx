import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrCreateCurrentUser } from "@/lib/getCurrentUser";
import { getOwnerAnalytics } from "@/services/analytics";
import { AnalyticsStats } from "@/components/shared/AnalyticsStats";
import { ViewsChart } from "@/components/shared/ViewsChart";
import { ProjectAnalyticsTable } from "@/components/shared/ProjectAnalyticsTable";

export default async function DashboardAnalyticsPage() {
  await auth.protect();
  const user = await getOrCreateCurrentUser();
  if (!user) redirect("/");
  if (!user.onboardingCompletedAt) redirect("/onboarding");

  const analytics = await getOwnerAnalytics(user.id);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="font-display text-2xl font-bold">Analytics</h1>
        <p className="text-sm text-muted-foreground">How your projects are performing, at a glance.</p>
      </div>

      <AnalyticsStats totals={analytics.totals} />

      <div>
        <h2 className="mb-4 font-display text-lg font-semibold">Views, last 14 days</h2>
        {analytics.totals.projects === 0 ? (
          <p className="text-sm text-muted-foreground">No projects yet — nothing to chart.</p>
        ) : (
          <div className="rounded-lg border border-border p-4">
            <ViewsChart data={analytics.viewsByDay} />
          </div>
        )}
      </div>

      <div>
        <h2 className="mb-4 font-display text-lg font-semibold">By project</h2>
        <ProjectAnalyticsTable projects={analytics.projects} />
      </div>
    </div>
  );
}
