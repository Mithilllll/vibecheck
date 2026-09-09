import { ScoreRing } from "./score-ring";
import { InsightCard } from "./insight-card";
import { PersonaCard } from "./persona-card";
import { Lightbulb, TrendingUp } from "lucide-react";
import type { VibeAnalysis } from "@/lib/validations/analysis";

interface AnalysisReportProps {
  analysis: VibeAnalysis;
}

export function AnalysisReport({ analysis }: AnalysisReportProps) {
  return (
    <div className="space-y-10">
      {/* Alignment Overview */}
      <section className="rounded-xl border border-border-default bg-bg-raised overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-0">
          <div className="flex items-center justify-center p-8 md:p-10 md:border-r border-b md:border-b-0 border-border-subtle bg-bg-elevated/30">
            <ScoreRing score={analysis.score} />
          </div>
          <div className="p-8 md:p-10 space-y-6">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest text-text-tertiary">
                Verdict
              </p>
              <p className="mt-2 text-lg leading-relaxed text-text-primary">
                {analysis.verdict}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg border border-border-subtle bg-bg-elevated/40 p-4">
                <p className="text-[10px] uppercase tracking-widest text-text-tertiary">
                  Intended vibe
                </p>
                <p className="mt-1.5 text-sm text-text-primary leading-relaxed">
                  {analysis.intendedVibe}
                </p>
              </div>
              <div className="rounded-lg border border-border-subtle bg-bg-elevated/40 p-4">
                <p className="text-[10px] uppercase tracking-widest text-text-tertiary">
                  Perceived vibe
                </p>
                <p className="mt-1.5 text-sm text-text-primary leading-relaxed">
                  {analysis.perceivedVibe}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Perception Insights */}
      <section>
        <SectionHeader
          eyebrow="Key insights"
          title="What your visual is actually communicating"
        />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {analysis.insightBullets.map((text, i) => (
            <InsightCard key={i} index={i} text={text} />
          ))}
        </div>
      </section>

      {/* Audience Reactions */}
      <section>
        <SectionHeader
          eyebrow="Audience reactions"
          title="How six different viewers would respond"
        />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {analysis.personaReactions.map((p) => (
            <PersonaCard
              key={p.persona}
              persona={p.persona}
              reaction={p.reaction}
            />
          ))}
        </div>
      </section>

      {/* Improvement Suggestions */}
      <section>
        <SectionHeader
          eyebrow="Improvement suggestions"
          title="Concrete changes to tighten the message"
          icon={Lightbulb}
        />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {analysis.improvementSuggestions.map((s, i) => (
            <SuggestionCard
              key={i}
              index={i}
              text={s}
              variant="improvement"
            />
          ))}
        </div>
      </section>

      {/* Trend-Aware Recommendations */}
      <section>
        <SectionHeader
          eyebrow="Trend-aware notes"
          title="Make it feel current within today's creator aesthetics"
          icon={TrendingUp}
        />
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          {analysis.trendSuggestions.map((s, i) => (
            <SuggestionCard key={i} index={i} text={s} variant="trend" />
          ))}
        </div>
      </section>
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  icon: Icon,
}: {
  eyebrow: string;
  title: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-widest text-accent">
        {eyebrow}
      </p>
      <div className="mt-2 flex items-center gap-3">
        {Icon && (
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-bg-elevated border border-border-subtle text-accent">
            <Icon className="h-3.5 w-3.5" />
          </div>
        )}
        <h2 className="text-lg md:text-xl font-semibold tracking-tight text-balance">
          {title}
        </h2>
      </div>
    </div>
  );
}

function SuggestionCard({
  index,
  text,
  variant,
}: {
  index: number;
  text: string;
  variant: "improvement" | "trend";
}) {
  const label = variant === "improvement" ? "FIX" : "TREND";
  return (
    <div className="rounded-xl border border-border-default bg-bg-raised p-5 flex">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-bg-elevated border border-border-subtle font-mono text-[10px] text-text-tertiary mr-3">
        {String(index + 1).padStart(2, "0")}
      </div>
      <div className="min-w-0 flex-1">
        <div className="font-mono text-[10px] uppercase tracking-widest text-text-tertiary">
          {label}
        </div>
        <p className="mt-1.5 text-sm text-text-primary leading-relaxed">
          {text}
        </p>
      </div>
    </div>
  );
}
