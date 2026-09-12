import type { AnalysisResult } from "./types";

// In-memory store for analysis results, keyed by id. This is intentionally
// simple for the MVP: results live only for the lifetime of the running
// server process. Swap this module for a real database (Postgres, Redis,
// etc.) to make shared links durable across restarts/deploys.

declare global {
  var __libaResultStore: Map<string, AnalysisResult> | undefined;
}

const MAX_ENTRIES = 500;

function getStore(): Map<string, AnalysisResult> {
  if (!globalThis.__libaResultStore) {
    globalThis.__libaResultStore = new Map();
  }
  return globalThis.__libaResultStore;
}

export function saveResult(result: AnalysisResult): void {
  const store = getStore();
  store.set(result.id, result);
  if (store.size > MAX_ENTRIES) {
    const oldestKey = store.keys().next().value;
    if (oldestKey) store.delete(oldestKey);
  }
}

export function getResult(id: string): AnalysisResult | undefined {
  return getStore().get(id);
}
