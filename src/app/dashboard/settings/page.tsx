import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserByUsername } from "@/services/users";
import { getOrCreateCurrentUser } from "@/lib/getCurrentUser";
import { listDepartments } from "@/services/taxonomy";
import { ProfileEditForm } from "@/features/profile/components/ProfileEditForm";

export default async function DashboardSettingsPage() {
  await auth.protect();
  const user = await getOrCreateCurrentUser();
  if (!user) redirect("/");

  const [departments, fullUser] = await Promise.all([
    listDepartments(),
    getUserByUsername(user.username),
  ]);

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Settings</h1>
      <ProfileEditForm
        departments={departments}
        defaults={{
          username: user.username,
          name: user.name,
          headline: user.headline ?? "",
          bio: user.bio ?? "",
          departmentId: user.departmentId ?? "",
          githubUrl: user.githubUrl ?? "",
          linkedinUrl: user.linkedinUrl ?? "",
          portfolioUrl: user.portfolioUrl ?? "",
          skills: fullUser?.skills.map((s) => s.technology.name).join(", ") ?? "",
        }}
      />
    </div>
  );
}
