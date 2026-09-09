import {
  Target,
  Users,
  Sparkles,
  TrendingUp,
  Eye,
  Gauge,
} from "lucide-react";

const FEATURES = [
  {
    icon: Gauge,
    title: "Alignment scoring",
    body: "A 0–100 score that quantifies how closely your creative reads as the vibe you intended.",
  },
  {
    icon: Users,
    title: "Six audience personas",
    body: "Reactions from a Gen Z trend chaser, brand marketer, indie artist, casual viewer, skeptical critic, and community mod.",
  },
  {
    icon: Eye,
    title: "Perception insights",
    body: "Sharp observations about what your visual actually communicates — color, composition, focal point, mood.",
  },
  {
    icon: Target,
    title: "Intended vs. perceived",
    body: "See the gap between the vibe you wrote down and the vibe your image is actually emitting.",
  },
  {
    icon: Sparkles,
    title: "Practical suggestions",
    body: "Concrete, visual changes to tighten the message — not vague advice you can't act on.",
  },
  {
    icon: TrendingUp,
    title: "Trend-aware notes",
    body: "Cues to make your work feel current within contemporary creator aesthetics.",
  },
];

export function Features() {
  return (
    <section
      id="features"
      className="border-b border-border-subtle/60 py-24 md:py-32"
    >
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            What you get
          </p>
          <h2 className="mt-3 text-display font-semibold tracking-tight text-balance">
            A creative intelligence layer between you and the publish button.
          </h2>
        </div>

        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((f) => (
            <div
              key={f.title}
              className="group relative rounded-xl border border-border-default bg-bg-raised p-6 transition-colors hover:border-border-strong"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-bg-elevated border border-border-subtle text-accent">
                <f.icon className="h-4 w-4" strokeWidth={2} />
              </div>
              <h3 className="mt-5 text-base font-semibold tracking-tight">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {f.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
