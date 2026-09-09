import Link from "next/link";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { Button } from "@/components/ui/button";
import { ProjectCard } from "@/components/projects/project-card";
import { EmptyState } from "@/components/projects/empty-state";
import { Plus } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const user = await requireUser();

  const projects = await prisma.project.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: {
      analysisResults: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { score: true },
      },
      mediaAssets: {
        where: { type: "IMAGE" },
        take: 1,
        select: { fileUrl: true },
      },
    },
  });

  const totalAnalyses = projects.reduce(
    (sum, p) => sum + (p.analysisResults.length > 0 ? 1 : 0),
    0
  );
  const avgScore =
    projects.filter((p) => p.analysisResults[0]).length > 0
      ? Math.round(
          projects
            .filter((p) => p.analysisResults[0])
            .reduce((s, p) => s + (p.analysisResults[0]?.score ?? 0), 0) /
            projects.filter((p) => p.analysisResults[0]).length
        )
      : null;

  return (
    <div className="container-page pt-10">
      <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-sm text-text-tertiary">
            Welcome back, {user.name?.split(" ")[0] ?? "creator"}.
          </p>
          <h1 className="mt-1 text-display font-semibold tracking-tight">
            Dashboard
          </h1>
        </div>
        <Button asChild>
          <Link href="/projects/new">
            <Plus className="h-4 w-4" />
            New project
          </Link>
        </Button>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Stat label="Projects" value={projects.length.toString()} />
        <Stat label="Analyses run" value={totalAnalyses.toString()} />
        <Stat
          label="Average alignment"
          value={avgScore !== null ? `${avgScore}/100` : "—"}
        />
      </div>

      <section className="mt-12">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold tracking-tight">
            Recent projects
          </h2>
          {projects.length > 0 && (
            <span className="text-xs text-text-tertiary">
              {projects.length} total
            </span>
          )}
        </div>

        {projects.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p) => (
              <ProjectCard
                key={p.id}
                id={p.id}
                title={p.title}
                intendedVibe={p.intendedVibe}
                createdAt={p.createdAt}
                imageUrl={p.mediaAssets[0]?.fileUrl ?? null}
                score={p.analysisResults[0]?.score ?? null}
                hasAnalysis={p.analysisResults.length > 0}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border-default bg-bg-raised p-5">
      <div className="text-xs uppercase tracking-widest text-text-tertiary">
        {label}
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight tabular-nums">
        {value}
      </div>
    </div>
  );
}
