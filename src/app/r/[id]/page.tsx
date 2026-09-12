"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ResultView } from "@/components/ResultView";
import { cacheResultLocally, readCachedResult } from "@/lib/local-result-cache";
import type { AnalysisResult } from "@/lib/types";

type LoadState =
  | { status: "loading" }
  | { status: "found"; result: AnalysisResult }
  | { status: "not-found" };

export default function ResultPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [state, setState] = useState<LoadState>(() => {
    const cached = readCachedResult(id);
    return cached ? { status: "found", result: cached } : { status: "loading" };
  });
  const [noKey, setNoKey] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const cached = readCachedResult(id);

    // Always check the server too: it's the source of truth when it has the
    // result (e.g. someone else's shared link, or a fresh same-instance
    // view), and confirms whether real analysis is configured server-side.
    fetch(`/api/result/${id}`)
      .then(async (res) => {
        if (cancelled) return;
        if (res.ok) {
          const data = await res.json();
          cacheResultLocally(data.result);
          setState({ status: "found", result: data.result });
        } else if (!cached) {
          setState({ status: "not-found" });
        }
      })
      .catch(() => {
        if (!cancelled && !cached) setState({ status: "not-found" });
      });

    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => !cancelled && setNoKey(!data.llmConfigured))
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [id]);

  if (state.status === "loading") {
    return (
      <>
        <Header />
        <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-24 pt-10 sm:pt-14">
          <div className="skeleton h-[420px] rounded-2xl border border-border" />
        </main>
        <Footer />
      </>
    );
  }

  if (state.status === "not-found") {
    return (
      <>
        <Header />
        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-5 py-24 text-center">
          <p className="font-display text-2xl font-semibold">This analysis is gone. 👻</p>
          <p className="mt-3 max-w-md text-sm text-muted">
            This link doesn&apos;t resolve in this browser or on the server anymore. Results aren&apos;t stored in a
            database in this demo, so shared links only work reliably in the browser that generated them. Run a new
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

  return (
    <>
      <Header />
      <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-24 pt-10 sm:pt-14">
        <ResultView result={state.result} noKey={noKey} />
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
