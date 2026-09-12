import { ClaimCard } from "./ClaimCard";
import { CopyLinkButton } from "./CopyLinkButton";
import { DemoBanner } from "./DemoBanner";
import { Disclaimer } from "./Disclaimer";
import { ScoreGauge } from "./ScoreGauge";
import type { AnalysisResult, ClaimStatus } from "@/lib/types";

const STATUS_ORDER: Record<ClaimStatus, number> = { contradicted: 0, unverified: 1, supported: 2 };

export function ResultView({ result, noKey }: { result: AnalysisResult; noKey: boolean }) {
  const sortedClaims = [...result.claims].sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
  const { counts } = result.score;

  return (
    <>
      {result.demo && (
        <div className="mb-6">
          <DemoBanner noKey={noKey} />
        </div>
      )}

      <section className="animate-fade-up flex flex-col items-center gap-6 rounded-2xl border border-border bg-surface p-6 text-center sm:p-10">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-soft">Lying Ass Index</p>
          <h1 className="mt-1 font-display text-xl font-bold sm:text-2xl">
            {result.profileName}
            {result.headline && (
              <span className="block text-sm font-normal text-muted sm:text-base">{result.headline}</span>
            )}
          </h1>
        </div>

        <ScoreGauge index={result.score.index} />

        <p className="font-display text-lg font-semibold" style={{ color: "var(--foreground)" }}>
          {result.score.labelEmoji} {result.score.label}
        </p>
        <p className="max-w-lg text-balance text-sm text-muted sm:text-base">{result.overallSummary}</p>

        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-soft">
          <span>{result.score.checkablePercent}% of claims were checkable against public sources</span>
        </div>

        <CopyLinkButton />
      </section>

      <section className="mt-6">
        <Disclaimer text={result.disclaimer} />
      </section>

      {result.sourceNote && (
        <section className="mt-4 rounded-xl border border-status-warn/30 bg-status-warn/10 p-4 text-xs leading-relaxed text-foreground sm:text-sm">
          <span className="font-semibold text-status-warn">Heads up: </span>
          {result.sourceNote}
        </section>
      )}

      <section className="mt-10 grid grid-cols-3 gap-3 text-center sm:mt-14">
        <div className="rounded-xl border border-border bg-surface py-4">
          <p className="font-display text-2xl font-bold text-status-good">{counts.supported}</p>
          <p className="mt-1 text-xs text-muted-soft">Supported</p>
        </div>
        <div className="rounded-xl border border-border bg-surface py-4">
          <p className="font-display text-2xl font-bold text-status-warn">{counts.unverified}</p>
          <p className="mt-1 text-xs text-muted-soft">Unverified</p>
        </div>
        <div className="rounded-xl border border-border bg-surface py-4">
          <p className="font-display text-2xl font-bold text-status-bad">{counts.contradicted}</p>
          <p className="mt-1 text-xs text-muted-soft">Contradicted</p>
        </div>
      </section>

      <section className="mt-8 space-y-3 sm:mt-10">
        <h2 className="font-display text-lg font-semibold sm:text-xl">Claim-by-claim breakdown</h2>
        {sortedClaims.map((claim, i) => (
          <ClaimCard key={claim.id} claim={claim} index={i} />
        ))}
      </section>
    </>
  );
}
