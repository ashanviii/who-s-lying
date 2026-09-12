import type { ClaimStatus } from "@/lib/types";

const CONFIG: Record<ClaimStatus, { label: string; emoji: string; className: string }> = {
  supported: {
    label: "Supported",
    emoji: "🟢",
    className: "text-status-good border-status-good/30 bg-[--tw-bg]",
  },
  unverified: {
    label: "Unverified",
    emoji: "🟡",
    className: "text-status-warn border-status-warn/30",
  },
  contradicted: {
    label: "Contradicted",
    emoji: "🔴",
    className: "text-status-bad border-status-bad/30",
  },
};

const BG: Record<ClaimStatus, string> = {
  supported: "var(--status-good-bg)",
  unverified: "var(--status-warn-bg)",
  contradicted: "var(--status-bad-bg)",
};

export function StatusBadge({ status }: { status: ClaimStatus }) {
  const cfg = CONFIG[status];
  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${cfg.className}`}
      style={{ background: BG[status] }}
    >
      <span aria-hidden>{cfg.emoji}</span>
      {cfg.label}
    </span>
  );
}
