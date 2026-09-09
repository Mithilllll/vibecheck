interface InsightCardProps {
  index: number;
  text: string;
}

export function InsightCard({ index, text }: InsightCardProps) {
  return (
    <div className="rounded-xl border border-border-default bg-bg-raised p-5">
      <div className="font-mono text-xs text-text-tertiary tracking-widest">
        INSIGHT {String(index + 1).padStart(2, "0")}
      </div>
      <p className="mt-3 text-sm text-text-primary leading-relaxed">{text}</p>
    </div>
  );
}
