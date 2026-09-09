interface ScoreRingProps {
  score: number;
  size?: number;
}

function bandColor(score: number) {
  if (score >= 80) return "#34d399"; // success
  if (score >= 60) return "#a3e635"; // accent
  if (score >= 40) return "#fbbf24"; // warn
  return "#f87171"; // danger
}

function bandLabel(score: number) {
  if (score >= 80) return "Strong alignment";
  if (score >= 60) return "Mostly aligned";
  if (score >= 40) return "Mixed signal";
  return "Off-target";
}

export function ScoreRing({ score, size = 160 }: ScoreRingProps) {
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, score));
  const offset = circumference - (clamped / 100) * circumference;
  const color = bandColor(clamped);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#26262d"
            strokeWidth={stroke}
            fill="none"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={color}
            strokeWidth={stroke}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{
              transition: "stroke-dashoffset 0.6s ease-out",
              filter: `drop-shadow(0 0 8px ${color}40)`,
            }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-semibold tabular-nums tracking-tight">
            {clamped}
          </span>
          <span className="text-xs text-text-tertiary">out of 100</span>
        </div>
      </div>
      <span
        className="mt-3 text-xs font-medium uppercase tracking-widest"
        style={{ color }}
      >
        {bandLabel(clamped)}
      </span>
    </div>
  );
}
