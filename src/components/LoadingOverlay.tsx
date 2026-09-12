"use client";

import { useEffect, useState } from "react";

const MESSAGES = [
  "Reading between the buzzwords…",
  "Googling your \"Fortune 500 company\"…",
  "Counting how many times you said \"synergy\"…",
  "Cross-referencing your timeline for plot holes…",
  "Checking if that university actually has that major…",
  "Asking around about your \"800% growth\"…",
  "Fact-checking your self-nominated award…",
  "Separating vibes from verifiable facts…",
  "Politely interrogating the internet…",
];

export function LoadingOverlay() {
  const [i, setI] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setI((n) => (n + 1) % MESSAGES.length), 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="animate-fade-in flex flex-col items-center gap-6 py-16 text-center">
      <div className="flex gap-2">
        {[0, 1, 2].map((d) => (
          <span
            key={d}
            className="h-3 w-3 rounded-full bg-brand"
            style={{ animation: "pulse-dot 1.2s ease-in-out infinite", animationDelay: `${d * 0.15}s` }}
          />
        ))}
      </div>
      <p className="font-display text-lg font-medium text-foreground sm:text-xl" aria-live="polite">
        {MESSAGES[i]}
      </p>
      <p className="max-w-sm text-sm text-muted-soft">
        This can take up to 30-60 seconds — we&apos;re actually searching the web, not just vibing.
      </p>
    </div>
  );
}
