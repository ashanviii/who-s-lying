import Link from "next/link";
import { isLlmConfigured } from "@/lib/llm-client";
import { getResult } from "@/lib/store";
import { ClaimCard } from "@/components/ClaimCard";
import { CopyLinkButton } from "@/components/CopyLinkButton";
import { DemoBanner } from "@/components/DemoBanner";
import { Disclaimer } from "@/components/Disclaimer";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ScoreGauge } from "@/components/ScoreGauge";
import type { ClaimStatus } from "@/lib/types";

const STATUS_ORDER: Record<ClaimStatus, number> = { contradicted: 0, unverified: 1, supported: 2 };

export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = getResult(id);

  if (!result) {
    return (
      <>
        <Header />
        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-5 py-24 text-center">
          <p className="font-display text-2xl font-semibold">This analysis is gone. 👻</p>
          <p className="mt-3 max-w-md text-sm text-muted">
            Results live in server memory for this MVP and don&apos;t survive a restart or redeploy. Run a new
            analysis to get a fresh link.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-bold text-black"
          >
            Analyze a profile →
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const sortedClaims = [...result.claims].sort((a, b) => STATUS_ORDER[a.status] - STATUS_ORDER[b.status]);
  const { counts } = result.score;

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-24 pt-10 sm:pt-14">
        {result.demo && (
          <div className="mb-6">
            <DemoBanner noKey={!isLlmConfigured()} />
          </div>
        )}

        <section className="animate-fade-up flex flex-col items-center gap-6 rounded-2xl border border-border bg-surface p-6 text-center sm:p-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-soft">Lying Ass Index</p>
            <h1 className="mt-1 font-display text-xl font-bold sm:text-2xl">
              {result.profileName}
              {result.headline && <span className="block text-sm font-normal text-muted sm:text-base">{result.headline}</span>}
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

        <section className="mt-10 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium text-foreground hover:border-brand hover:text-brand"
          >
            Analyze another profile →
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
