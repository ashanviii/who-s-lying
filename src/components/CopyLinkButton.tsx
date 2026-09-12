"use client";

import { useState } from "react";

export function CopyLinkButton({ text, label = "Copy link" }: { text?: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(text ?? window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard API unavailable (older browser, insecure context) — fail silently.
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-brand hover:text-brand"
    >
      {copied ? "Copied ✓" : label}
    </button>
  );
}
