"use client";

import { useState } from "react";
import { StatusBadge } from "./StatusBadge";
import type { ScoredClaim } from "@/lib/types";

const CATEGORY_LABEL: Record<ScoredClaim["category"], string> = {
  title: "Title",
  experience: "Experience",
  achievement: "Achievement",
  metric: "Metric",
  leadership: "Leadership",
  education: "Education",
  other: "Other",
};

export function ClaimCard({ claim, index }: { claim: ScoredClaim; index: number }) {
  const [open, setOpen] = useState(false);
  const hasEvidence = claim.evidence.length > 0;

  return (
    <div
      className="animate-fade-up rounded-xl border border-border bg-surface p-4 transition-colors hover:border-border-soft sm:p-5"
      style={{ animationDelay: `${Math.min(index, 10) * 40}ms` }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={claim.status} />
          <span className="rounded-full border border-border-soft px-2.5 py-1 text-xs font-medium text-muted-soft">
            {CATEGORY_LABEL[claim.category]}
          </span>
        </div>
        <span className="text-xs font-medium text-muted-soft">{claim.confidence}% confidence</span>
      </div>

      <p className="mt-3 text-[15px] font-medium leading-snug text-foreground sm:text-base">{claim.text}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{claim.reasoning}</p>

      {hasEvidence && (
        <div className="mt-3">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="text-xs font-semibold text-brand hover:underline"
          >
            {open ? "Hide evidence" : `Show evidence (${claim.evidence.length})`}
          </button>
          {open && (
            <ul className="mt-3 space-y-2 border-t border-border-soft pt-3">
              {claim.evidence.map((e, i) => (
                <li key={i} className="rounded-lg border border-border-soft bg-background-elevated p-3 text-sm">
                  <p className="text-muted">&ldquo;{e.snippet}&rdquo;</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs">
                    <span
                      className={e.supports ? "text-status-good" : "text-status-bad"}
                    >
                      {e.supports ? "Supports claim" : "Contradicts claim"}
                    </span>
                    <span className="text-muted-soft">·</span>
                    <a
                      href={e.url}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="truncate text-brand hover:underline"
                    >
                      {e.sourceTitle || e.url}
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
