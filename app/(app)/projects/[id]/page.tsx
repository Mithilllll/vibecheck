import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ImageIcon, Video, Music, Loader2 } from "lucide-react";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { Badge } from "@/components/ui/badge";
import { AnalysisReport } from "@/components/analysis/analysis-report";
import { ReanalyzeButton } from "@/components/projects/reanalyze-button";
import {
  sanitizeAnalysisInput,
  vibeAnalysisSchema,
  type VibeAnalysis,
} from "@/lib/validations/analysis";

export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ analysisError?: string }>;
}

function formatDateTime(d: Date) {
  return d.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function bytesToHuman(n: number) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export default async function ProjectDetailPage({
  params,
  searchParams,
}: PageProps) {
  const user = await requireUser();
  const { id } = await params;
  const { analysisError } = await searchParams;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      mediaAssets: { orderBy: { createdAt: "asc" } },
      analysisResults: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!project || project.userId !== user.id) {
    notFound();
  }

  // Reconstruct the strict VibeAnalysis shape from the persisted row.
  // The DB row's JSON columns are typed loosely, so we re-validate at the boundary.
  const latest = project.analysisResults[0] ?? null;
  let analysis: VibeAnalysis | null = null;
  if (latest) {
    try {
      const candidate = {
        score: latest.score,
        verdict: latest.verdict,
        intendedVibe: latest.intendedVibe,
        perceivedVibe: latest.perceivedVibe,
        insightBullets: JSON.parse(latest.insightBullets || "[]"),
        personaReactions: JSON.parse(latest.personaReactions || "[]"),
        improvementSuggestions: JSON.parse(latest.improvementSuggestions || "[]"),
        trendSuggestions: JSON.parse(latest.trendSuggestions || "[]"),
      };
      const parsed = vibeAnalysisSchema.safeParse(sanitizeAnalysisInput(candidate));
      analysis = parsed.success ? parsed.data : null;
    } catch {
      analysis = null;
    }
  }

  const primaryImage = project.mediaAssets.find(
    (m: { type: string }) => m.type === "IMAGE"
  );
  const secondaryAssets = project.mediaAssets.filter(
    (m: { type: string }) => m.type !== "IMAGE"
  );

  return (
    <div className="container-page pt-10">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors focus-ring rounded-md"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to dashboard
      </Link>

      {/* Header */}
      <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            Analysis report
          </p>
          <h1 className="mt-2 text-display font-semibold tracking-tight">
            {project.title}
          </h1>
          <p className="mt-2 text-sm text-text-tertiary">
            Created {formatDateTime(project.createdAt)}
            {latest && (
              <>
                {" "}· Last analyzed {formatDateTime(latest.createdAt)}
              </>
            )}
          </p>
        </div>
        <ReanalyzeButton projectId={project.id} />
      </div>

      {analysisError && (
        <div
          role="alert"
          className="mt-6 rounded-md border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          {analysisError} You can re-run from this page.        </div>
      )}

      {/* Two-column layout: media + context | report */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sidebar: Media + Submission Context */}
        <aside className="lg:col-span-1 space-y-6">
          {/* Media preview */}
          <div className="rounded-xl border border-border-default bg-bg-raised overflow-hidden">
            <div className="border-b border-border-subtle px-5 py-3">
              <h2 className="text-sm font-semibold tracking-tight">
                Media preview
              </h2>
            </div>
            {primaryImage ? (
              <div className="bg-bg-elevated">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={primaryImage.fileUrl}
                  alt={project.title}
                  className="w-full h-auto max-h-[420px] object-contain"
                />
              </div>
            ) : (
              <div className="p-8 text-center text-text-tertiary text-sm">
                No image attached
              </div>
            )}

            {primaryImage && (
              <div className="px-5 py-3 text-xs text-text-tertiary border-t border-border-subtle flex items-center justify-between">
                <span className="truncate max-w-[60%]">
                  {primaryImage.fileName}
                </span>
                <span className="tabular-nums">
                  {bytesToHuman(primaryImage.sizeBytes)}
                </span>
              </div>
            )}

            {secondaryAssets.length > 0 && (
              <div className="px-5 py-4 border-t border-border-subtle space-y-2">
                <p className="text-[10px] uppercase tracking-widest text-text-tertiary">
                  Also attached
                </p>
                {secondaryAssets.map(
                  (
                    a: {
                      id: string;
                      type: string;
                      fileName: string;
                      sizeBytes: number;
                    }
                  ) => (
                    <SecondaryAssetRow
                      key={a.id}
                      type={a.type}
                      fileName={a.fileName}
                      sizeBytes={a.sizeBytes}
                    />
                  )
                )}
              </div>
            )}
          </div>

          {/* Submission Context */}
          <div className="rounded-xl border border-border-default bg-bg-raised">
            <div className="border-b border-border-subtle px-5 py-3">
              <h2 className="text-sm font-semibold tracking-tight">
                Submission context
              </h2>
            </div>
            <dl className="px-5 py-4 space-y-4 text-sm">
              <ContextRow label="Intended vibe" value={project.intendedVibe} />
              {project.platformContext && (
                <ContextRow label="Platform" value={project.platformContext} />
              )}
              {project.targetAudience && (
                <ContextRow
                  label="Target audience"
                  value={project.targetAudience}
                />
              )}
              {project.captionContext && (
                <ContextRow label="Caption" value={project.captionContext} />
              )}
            </dl>
          </div>
        </aside>

        {/* Main: Report */}
        <div className="lg:col-span-2">
          {analysis ? (
            <AnalysisReport analysis={analysis} />
          ) : (
            <NoAnalysisYet projectId={project.id} />
          )}
        </div>
      </div>
    </div>
  );
}

function ContextRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[10px] uppercase tracking-widest text-text-tertiary">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-text-primary leading-relaxed">
        {value}
      </dd>
    </div>
  );
}

function SecondaryAssetRow({
  type,
  fileName,
  sizeBytes,
}: {
  type: string;
  fileName: string;
  sizeBytes: number;
}) {
  const Icon = type === "VIDEO" ? Video : type === "AUDIO" ? Music : ImageIcon;
  const note =
    type === "VIDEO"
      ? "Video analysis pipeline coming next"
      : type === "AUDIO"
      ? "Audio mood interpretation coming next"
      : null;

  return (
    <div className="rounded-md border border-border-subtle bg-bg-elevated/40 p-3">
      <div className="flex items-center gap-2.5">
        <Icon className="h-3.5 w-3.5 text-text-tertiary shrink-0" />
        <span className="text-xs text-text-primary truncate flex-1">
          {fileName}
        </span>
        <span className="text-[10px] text-text-tertiary tabular-nums">
          {bytesToHuman(sizeBytes)}
        </span>
      </div>
      {note && (
        <div className="mt-1.5 ml-6">
          <Badge variant="outline" className="text-[10px]">
            {note}
          </Badge>
        </div>
      )}
    </div>
  );
}

function NoAnalysisYet({ projectId }: { projectId: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border-default bg-bg-raised/40 p-12 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-bg-elevated border border-border-subtle">
        <Loader2 className="h-5 w-5 text-accent" />
      </div>
      <h3 className="mt-5 text-lg font-semibold tracking-tight">
        No analysis on this project yet
      </h3>
      <p className="mx-auto mt-2 max-w-sm text-sm text-text-secondary">
        Run analysis to see alignment scoring, persona reactions, and
        practical suggestions.
      </p>
      <div className="mt-6 inline-block">
        <ReanalyzeButton projectId={projectId} />
      </div>
    </div>
  );
}
