const STEPS = [
  {
    n: "01",
    title: "Define your intent",
    body: "Write down the vibe you want your work to communicate. Add platform, audience, and caption context if it helps.",
  },
  {
    n: "02",
    title: "Upload your visual",
    body: "Drop in the image you're about to publish. Optional video and audio fields are reserved for upcoming pipelines.",
  },
  {
    n: "03",
    title: "Run analysis",
    body: "VibeCheck reads the visual and returns a structured report: alignment score, perceived vibe, persona reactions, and concrete next steps.",
  },
  {
    n: "04",
    title: "Refine, then publish",
    body: "Apply the suggestions, re-run the analysis to confirm the gap closed, and ship with confidence.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-b border-border-subtle/60 py-24 md:py-32"
    >
      <div className="container-page">
        <div className="max-w-2xl">
          <p className="font-mono text-xs uppercase tracking-widest text-accent">
            How it works
          </p>
          <h2 className="mt-3 text-display font-semibold tracking-tight text-balance">
            Four steps, one short loop.
          </h2>
        </div>

        <ol className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border-subtle rounded-xl overflow-hidden border border-border-default">
          {STEPS.map((s) => (
            <li key={s.n} className="bg-bg-raised p-6 lg:p-8">
              <div className="font-mono text-xs text-text-tertiary tracking-widest">
                {s.n}
              </div>
              <h3 className="mt-6 text-lg font-semibold tracking-tight">
                {s.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-text-secondary">
                {s.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
