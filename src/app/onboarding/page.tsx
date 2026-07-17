import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getOrCreateCurrentUser } from "@/lib/getCurrentUser";
import { listDepartments } from "@/services/taxonomy";
import { OnboardingForm } from "@/features/onboarding/components/OnboardingForm";

export default async function OnboardingPage() {
  await auth.protect();

  const [user, departments, clerkUser] = await Promise.all([
    getOrCreateCurrentUser(),
    listDepartments(),
    currentUser(),
  ]);

  if (!user) {
    // No primary email on the Clerk account — genuinely can't proceed without one.
    redirect("/");
  }

  if (user.onboardingCompletedAt) {
    redirect("/dashboard");
  }

  const defaultName =
    [clerkUser?.firstName, clerkUser?.lastName].filter(Boolean).join(" ") || user.name;

  return (
    <main className="mx-auto max-w-md px-6 py-16">
      <h1 className="text-2xl font-bold mb-2">Set up your profile</h1>
      <p className="text-sm text-muted-foreground mb-8">
        This is what other students will see on your projects and profile.
      </p>
      <OnboardingForm
        departments={departments}
        defaultUsername={user.username}
        defaultName={defaultName}
      />
    </main>
  );
}
