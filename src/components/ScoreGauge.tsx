import type { CSSProperties } from "react";

function colorForIndex(index: number): string {
  if (index <= 35) return "var(--status-good)";
  if (index <= 65) return "var(--status-warn)";
  return "var(--status-bad)";
}

export function ScoreGauge({ index, size = 220 }: { index: number; size?: number }) {
  const radius = 88;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, index));
  const offset = circumference * (1 - clamped / 100);
  const color = colorForIndex(clamped);

  const style = {
    "--gauge-circumference": `${circumference}`,
    "--gauge-offset": `${offset}`,
  } as CSSProperties;

  return (
    <div
      className="relative shrink-0"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`Lying Ass Index: ${clamped} out of 100`}
    >
      <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
        <circle cx="100" cy="100" r={radius} fill="none" stroke="var(--border)" strokeWidth="14" />
        <circle
          cx="100"
          cy="100"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="14"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference}
          className="gauge-arc"
          style={style}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-5xl font-bold tabular-nums" style={{ color }}>
          {clamped}
        </span>
        <span className="text-xs font-medium uppercase tracking-wider text-muted-soft">out of 100</span>
      </div>
    </div>
  );
}
