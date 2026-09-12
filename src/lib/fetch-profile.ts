export type DetectedInput = { type: "url" | "text"; value: string };

const URL_PATTERN = /^https?:\/\/\S+$/i;

export function detectInputType(raw: string): DetectedInput {
  const trimmed = raw.trim();
  if (URL_PATTERN.test(trimmed) && !trimmed.includes("\n") && trimmed.length < 500) {
    return { type: "url", value: trimmed };
  }
  return { type: "text", value: trimmed };
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&#x27;|&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Best-effort fetch of a LinkedIn (or other) profile URL. LinkedIn blocks
 * unauthenticated scraping in almost all cases, so this routinely returns
 * only a login-wall shell or fails outright - callers must treat the result
 * as a bonus, not a guarantee, and fall back to letting the research step's
 * web-search tool find public information about the URL/name instead.
 */
export async function fetchUrlContent(url: string): Promise<{ text: string; ok: boolean }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
      redirect: "follow",
    });
    clearTimeout(timeout);
    if (!res.ok) return { text: "", ok: false };
    const html = await res.text();
    const text = stripHtml(html).slice(0, 6000);
    // LinkedIn's logged-out shell is tiny and generic; treat very short
    // bodies as an effective failure so the caller knows to lean on search.
    const ok = text.length > 400;
    return { text, ok };
  } catch {
    return { text: "", ok: false };
  }
}
