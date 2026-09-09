import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border-subtle/60">
      {/* Ambient gradient backdrop */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-grid-fade"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[400px] bg-[radial-gradient(ellipse_60%_60%_at_50%_0%,rgba(163,230,53,0.08),transparent_70%)]"
      />

      <div className="container-page relative pt-20 md:pt-28 pb-20 md:pb-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border-default bg-bg-raised/60 px-3 py-1 text-xs text-text-secondary">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse-soft" />
            Synthetic audience feedback for creators
          </div>

          <h1 className="mt-6 text-display-xl font-semibold tracking-tight text-balance">
            VibeCheck
          </h1>
          <p className="mt-4 text-display-lg font-medium text-text-primary tracking-tight text-balance">
            Test your creative intent before you publish.
          </p>
          <p className="mx-auto mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-text-secondary text-balance">
            Upload a visual, define the vibe you want it to communicate, and get
            audience-style feedback, alignment scoring, and concrete suggestions
            to improve it.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/signup">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="#how-it-works">View Demo Flow</Link>
            </Button>
          </div>
        </div>

        {/* Visual stage */}
        <div className="relative mx-auto mt-20 max-w-5xl">
          <div className="rounded-2xl border border-border-default bg-bg-raised overflow-hidden shadow-[0_0_60px_-20px_rgba(163,230,53,0.15)]">
            <div className="flex items-center gap-1.5 border-b border-border-subtle px-4 py-3">
              <span className="h-2.5 w-2.5 rounded-full bg-bg-elevated border border-border-default" />
              <span className="h-2.5 w-2.5 rounded-full bg-bg-elevated border border-border-default" />
              <span className="h-2.5 w-2.5 rounded-full bg-bg-elevated border border-border-default" />
              <span className="ml-3 text-xs font-mono text-text-tertiary">
                vibecheck.app/projects/album-cover-r1
              </span>
            </div>
            <div className="grid grid-cols-12 gap-0 min-h-[320px]">
              <div className="col-span-5 border-r border-border-subtle p-6 flex flex-col justify-between">
                <div>
                  <div className="text-xs uppercase tracking-widest text-text-tertiary">
                    Alignment
                  </div>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-6xl font-semibold text-text-primary tabular-nums">
                      78
                    </span>
                    <span className="text-text-tertiary text-sm">/ 100</span>
                  </div>
                  <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                    Reads as moody and cinematic, but warmth in the highlights
                    softens the intended late-night isolation.
                  </p>
                </div>
                <div className="mt-6 grid grid-cols-2 gap-3 text-xs">
                  <Tile label="Intended" value="Cold, cinematic, alone" />
                  <Tile label="Perceived" value="Moody but warm-toned" />
                </div>
              </div>
              <div className="col-span-7 p-6 grid grid-cols-2 gap-3">
                <PersonaTile name="Indie Artist" tone="positive" />
                <PersonaTile name="Brand Marketer" tone="neutral" />
                <PersonaTile name="Skeptical Critic" tone="critical" />
                <PersonaTile name="Gen Z Trend Chaser" tone="positive" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-border-subtle bg-bg-elevated/60 p-3">
      <div className="text-[10px] uppercase tracking-widest text-text-tertiary">
        {label}
      </div>
      <div className="mt-1 text-text-primary font-medium leading-snug">
        {value}
      </div>
    </div>
  );
}

function PersonaTile({
  name,
  tone,
}: {
  name: string;
  tone: "positive" | "neutral" | "critical";
}) {
  const dot =
    tone === "positive"
      ? "bg-success"
      : tone === "critical"
      ? "bg-danger"
      : "bg-text-tertiary";
  return (
    <div className="rounded-lg border border-border-subtle bg-bg-elevated/40 p-3 flex flex-col">
      <div className="flex items-center gap-2 text-xs text-text-tertiary">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        {name}
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-bg-subtle overflow-hidden">
        <div
          className={`h-full ${
            tone === "positive"
              ? "bg-success/70 w-[78%]"
              : tone === "critical"
              ? "bg-danger/70 w-[34%]"
              : "bg-text-tertiary/70 w-[55%]"
          }`}
        />
      </div>
      <div className="mt-2 space-y-1.5">
        <div className="h-1.5 rounded bg-bg-subtle w-full" />
        <div className="h-1.5 rounded bg-bg-subtle w-[80%]" />
        <div className="h-1.5 rounded bg-bg-subtle w-[60%]" />
      </div>
    </div>
  );
}
