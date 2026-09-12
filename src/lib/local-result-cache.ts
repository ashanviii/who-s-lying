import type { AnalysisResult } from "./types";

// Serverless deployments (Vercel etc.) can route consecutive requests to
// different function instances with separate memory, so the server-side
// store in store.ts is only a best-effort cache, not a guarantee. Caching
// the result the browser already has in localStorage makes "view the
// analysis I just ran" work reliably regardless of which instance served
// the API call.

const PREFIX = "laba:result:";

export function cacheResultLocally(result: AnalysisResult): void {
  try {
    localStorage.setItem(PREFIX + result.id, JSON.stringify(result));
  } catch {
    // Storage unavailable (private browsing, quota, etc.) - not fatal.
  }
}

export function readCachedResult(id: string): AnalysisResult | null {
  try {
    const raw = localStorage.getItem(PREFIX + id);
    return raw ? (JSON.parse(raw) as AnalysisResult) : null;
  } catch {
    return null;
  }
}
