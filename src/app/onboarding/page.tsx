import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserByClerkId } from "@/services/users";
import { listDepartments } from "@/services/taxonomy";
import { OnboardingForm } from "@/features/onboarding/components/OnboardingForm";

export default async function OnboardingPage() {
  const { userId } = await auth.protect();

  const [user, departments, clerkUser] = await Promise.all([
    getUserByClerkId(userId),
    listDepartments(),
    currentUser(),
  ]);

  if (!user) {
    // Webhook hasn't landed yet (rare race on first sign-in) — send them back to try again shortly.
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
