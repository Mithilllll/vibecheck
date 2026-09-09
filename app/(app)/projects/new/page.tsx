import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { NewProjectForm } from "@/components/projects/new-project-form";

export const dynamic = "force-dynamic";

export default async function NewProjectPage() {
  await requireUser();

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
        <h1 className="text-display font-semibold tracking-tight">
          New project
        </h1>
        <p className="mt-2 text-sm text-text-secondary max-w-xl">
          Define your creative intent, drop in a visual, and run analysis to
          see how the work actually lands.
        </p>
      </div>

      <NewProjectForm />
    </div>
  );
}
