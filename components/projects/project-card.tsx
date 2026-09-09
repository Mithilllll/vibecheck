import Link from "next/link";
import { Badge } from "@/components/ui/badge";

interface ProjectCardProps {
  id: string;
  title: string;
  intendedVibe: string;
  createdAt: Date | string;
  imageUrl?: string | null;
  score?: number | null;
  hasAnalysis: boolean;
}

function formatDate(d: Date | string) {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function scoreBand(score: number) {
  if (score >= 80) return { label: "Strong alignment", variant: "success" as const };
  if (score >= 60) return { label: "Mostly aligned", variant: "default" as const };
  if (score >= 40) return { label: "Mixed signal", variant: "warn" as const };
  return { label: "Off-target", variant: "danger" as const };
}

export function ProjectCard({
  id,
  title,
  intendedVibe,
  createdAt,
  imageUrl,
  score,
  hasAnalysis,
}: ProjectCardProps) {
  return (
    <Link
      href={`/projects/${id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-border-default bg-bg-raised transition-colors hover:border-border-strong focus-ring"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-bg-elevated">
        {imageUrl ? (
          // Using img tag because uploads are protected/dynamic and don't need next/image opt
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={imageUrl}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-text-muted">
            <span className="text-xs uppercase tracking-widest">No preview</span>
          </div>
        )}
        {hasAnalysis && typeof score === "number" && (
          <div className="absolute top-3 right-3 rounded-md border border-border-default bg-bg-base/85 backdrop-blur-sm px-2.5 py-1 text-sm font-semibold tabular-nums">
            {score}
            <span className="ml-0.5 text-xs text-text-tertiary">/100</span>
          </div>
        )}
      </div>

      <div className="flex flex-1 flex-col p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-sm font-semibold tracking-tight text-text-primary line-clamp-1">
            {title}
          </h3>
          {hasAnalysis && typeof score === "number" ? (
            <Badge variant={scoreBand(score).variant}>
              {scoreBand(score).label}
            </Badge>
          ) : (
            <Badge variant="outline">Draft</Badge>
          )}
        </div>
        <p className="mt-1.5 text-xs text-text-secondary line-clamp-2 leading-relaxed">
          {intendedVibe}
        </p>
        <div className="mt-3 text-xs text-text-tertiary">
          {formatDate(createdAt)}
        </div>
      </div>
    </Link>
  );
}
