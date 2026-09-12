import type { ClaimCategory, ClaimStatus, ScoreBreakdown, ScoredClaim } from "./types";

const CATEGORY_WEIGHT: Record<ClaimCategory, number> = {
  metric: 1.5,
  education: 1.3,
  achievement: 1.3,
  leadership: 1.2,
  experience: 1.2,
  title: 1.0,
  other: 0.8,
};

const STATUS_PENALTY: Record<ClaimStatus, number> = {
  supported: 0,
  unverified: 0.4,
  contradicted: 1,
};

const LABELS: { max: number; label: string; emoji: string }[] = [
  { max: 15, label: "Certified Honest Human", emoji: "🕊️" },
  { max: 35, label: "Mostly Legit", emoji: "🙂" },
  { max: 55, label: "Embellishment Enjoyer", emoji: "✨" },
  { max: 75, label: "Chronic Overstater", emoji: "🎭" },
  { max: 100, label: "Certified Lying Ass", emoji: "🚩" },
];

export function computeScore(claims: ScoredClaim[]): ScoreBreakdown {
  const counts = { supported: 0, unverified: 0, contradicted: 0 };
  for (const c of claims) counts[c.status]++;

  if (claims.length === 0) {
    return {
      index: 0,
      label: "Nothing to Judge",
      labelEmoji: "🤷",
      checkablePercent: 0,
      counts,
    };
  }

  let totalWeight = 0;
  let penalty = 0;
  for (const c of claims) {
    const weight = CATEGORY_WEIGHT[c.category] ?? 0.8;
    totalWeight += weight;
    penalty += weight * STATUS_PENALTY[c.status];
  }

  const index = Math.max(0, Math.min(100, Math.round((penalty / totalWeight) * 100)));
  const checkable = counts.supported + counts.contradicted;
  const checkablePercent = Math.round((checkable / claims.length) * 100);
  const bucket = LABELS.find((l) => index <= l.max) ?? LABELS[LABELS.length - 1];

  return {
    index,
    label: bucket.label,
    labelEmoji: bucket.emoji,
    checkablePercent,
    counts,
  };
}
