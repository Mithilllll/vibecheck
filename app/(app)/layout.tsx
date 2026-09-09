import { redirect } from "next/navigation";
import { auth } from "@/lib/auth/config";
import { AppNav } from "@/components/nav/app-nav";
import { AuthSessionProvider } from "@/components/providers/session-provider";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <AuthSessionProvider>
      <div className="min-h-screen bg-bg-base">
        <AppNav
          userName={session.user.name ?? "Creator"}
          userEmail={session.user.email ?? ""}
        />
        <main className="pb-24">{children}</main>
      </div>
    </AuthSessionProvider>
  );
}
