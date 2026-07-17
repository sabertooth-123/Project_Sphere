import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getUserByClerkId, getUserByUsername } from "@/services/users";
import { listDepartments } from "@/services/taxonomy";
import { ProfileEditForm } from "@/features/profile/components/ProfileEditForm";

export default async function DashboardSettingsPage() {
  const { userId } = await auth.protect();
  const user = await getUserByClerkId(userId);
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
