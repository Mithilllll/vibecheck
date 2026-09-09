import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles } from "lucide-react";

export function EmptyState() {
  return (
    <div className="rounded-xl border border-dashed border-border-default bg-bg-raised/40 p-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-bg-elevated border border-border-subtle text-accent">
        <Sparkles className="h-5 w-5" />
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-tight">
        Your first VibeCheck is one upload away.
      </h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-text-secondary">
        Create a project, drop in a visual, and describe the vibe you want it
        to give off. We&apos;ll handle the rest.
      </p>
      <Button asChild className="mt-6">
        <Link href="/projects/new">
          <Plus className="h-4 w-4" />
          Create your first project
        </Link>
      </Button>
    </div>
  );
}
