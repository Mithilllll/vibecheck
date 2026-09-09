import Link from "next/link";
import { ArrowLeft, User, Mail, Calendar } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { SignOutButton } from "@/components/auth/sign-out-button";

export const dynamic = "force-dynamic";

function formatDate(d: Date) {
  return d.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default async function SettingsPage() {
  const sessionUser = await requireUser();

  const user = await prisma.user.findUnique({
    where: { id: sessionUser.id },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      _count: { select: { projects: true } },
    },
  });

  if (!user) {
    return null;
  }

  return (
    <div className="container-page pt-10">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors focus-ring rounded-md"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      <div className="mt-6 mb-10">
        <h1 className="text-display font-semibold tracking-tight">Settings</h1>
        <p className="mt-2 text-sm text-text-secondary">
          Manage your account and session.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl">
        {/* Account info */}
        <div className="lg:col-span-2 rounded-xl border border-border-default bg-bg-raised">
          <div className="border-b border-border-subtle px-6 py-4">
            <h2 className="text-sm font-semibold tracking-tight">
              Account
            </h2>
            <p className="text-xs text-text-tertiary mt-0.5">
              Read-only for now. Account editing is coming next.
            </p>
          </div>
          <dl className="divide-y divide-border-subtle">
            <Field icon={User} label="Name" value={user.name} />
            <Field icon={Mail} label="Email" value={user.email} />
            <Field
              icon={Calendar}
              label="Member since"
              value={formatDate(user.createdAt)}
            />
          </dl>
        </div>

        {/* Side panel */}
        <div className="space-y-4">
          <div className="rounded-xl border border-border-default bg-bg-raised p-6">
            <p className="text-[10px] uppercase tracking-widest text-text-tertiary">
              Activity
            </p>
            <div className="mt-2 text-3xl font-semibold tracking-tight tabular-nums">
              {user._count.projects}
            </div>
            <p className="mt-1 text-xs text-text-secondary">
              {user._count.projects === 1 ? "project" : "projects"} created
            </p>
          </div>

          <div className="rounded-xl border border-border-default bg-bg-raised p-6">
            <h3 className="text-sm font-semibold tracking-tight">
              Session
            </h3>
            <p className="mt-1.5 text-xs text-text-secondary leading-relaxed">
              Sign out of this device. You&apos;ll need to log in again to
              access your projects.
            </p>
            <div className="mt-4">
              <SignOutButton />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-4 px-6 py-4">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg-elevated border border-border-subtle text-text-tertiary shrink-0">
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <dt className="text-[10px] uppercase tracking-widest text-text-tertiary">
          {label}
        </dt>
        <dd className="mt-1 text-sm text-text-primary truncate">{value}</dd>
      </div>
    </div>
  );
}
