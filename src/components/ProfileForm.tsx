"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { LoadingOverlay } from "./LoadingOverlay";
import { cacheResultLocally } from "@/lib/local-result-cache";

export function ProfileForm() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(payload: { input?: string; example?: boolean }) {
    setError(null);
    setLoading(true);
    try {
      const endpoint = payload.example ? "/api/example" : "/api/analyze";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload.example ? undefined : JSON.stringify({ input: payload.input }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong. Try again.");
      }
      if (data.result) {
        cacheResultLocally(data.result);
      }
      router.push(`/r/${data.id}`);
    } catch (err) {
      setLoading(false);
      setError(err instanceof Error ? err.message : "Something went wrong. Try again.");
    }
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!input.trim() || loading) return;
    void submit({ input });
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-4 sm:p-6">
        <LoadingOverlay />
      </div>
    );
  }

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-border bg-surface p-4 shadow-2xl shadow-black/40 sm:p-6"
      >
        <label htmlFor="profile-input" className="sr-only">
          LinkedIn profile URL or pasted text
        </label>
        <textarea
          id="profile-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={
            "Paste a LinkedIn profile URL (e.g. linkedin.com/in/...) or the profile's About/Experience text here…"
          }
          rows={5}
          className="w-full resize-none rounded-xl border border-border-soft bg-background-elevated p-4 text-sm text-foreground placeholder:text-muted-soft focus:border-brand focus:outline-none sm:text-base"
        />
        <div className="mt-4 flex flex-col-reverse items-stretch gap-3 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={() => void submit({ example: true })}
            className="text-sm font-medium text-muted underline decoration-dotted underline-offset-4 hover:text-brand"
          >
            Try the demo profile instead
          </button>
          <button
            type="submit"
            disabled={!input.trim()}
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-black transition-transform enabled:hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
          >
            Analyze a profile
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </button>
        </div>
      </form>
      {error && (
        <div className="animate-fade-up mt-4 rounded-xl border border-status-bad/30 bg-status-bad/10 px-4 py-3 text-sm text-foreground">
          <span className="font-semibold text-status-bad">Couldn&apos;t do it: </span>
          {error}
        </div>
      )}
    </div>
  );
}
