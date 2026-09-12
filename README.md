# lying-ass-bitch.com

**How much bullshit is on this LinkedIn?**

A brutally funny, evidence-based LinkedIn profile analyzer. Paste a profile URL or its text, and get a claim-by-claim breakdown of what's 🟢 supported, 🟡 unverified, or 🔴 contradicted by public sources — plus an overall **Lying Ass Index**.

> The Lying Ass Index measures how well claims can be verified from public sources right now. It is **not** a verdict on anyone's honesty or character, and it is not a background-check tool. Absence of evidence isn't evidence of lying.

## How it works

1. **Extract** — the profile text (or fetched URL content) is sent to Claude, which pulls out every discrete, checkable claim: titles, employers, dates, degrees, metrics, awards, leadership claims, etc.
2. **Research** — each claim is handed to a second Claude call with Anthropic's server-side **web search tool** turned on, so the model actively searches the public web for corroborating or contradicting evidence rather than guessing from training data.
3. **Score** — every claim gets a status (supported / unverified / contradicted), a confidence level, reasoning, and cited evidence. A deterministic, transparent formula (see `src/lib/scoring.ts`) turns those statuses into the overall 0-100 index, weighted by how bold/impactful the claim category is (a fabricated revenue metric counts for more than a vague title).
4. **Share** — every analysis gets a shareable `/r/[id]` URL with a screenshot-ready results page.

No separate search API is required — claim verification uses Claude's built-in `web_search` tool, so the only credential you need is an Anthropic API key.

## Tech stack

- **Next.js 16** (App Router, TypeScript, Tailwind CSS v4) — one app for both the frontend and the API routes.
- **`@anthropic-ai/sdk`** — claim extraction (`output_config.format` structured JSON) and research/scoring (structured JSON + the `web_search` server tool).
- In-memory result store (`src/lib/store.ts`) — fine for an MVP/demo; swap in Postgres/Redis/etc. for production so shared links survive restarts.

## Getting started

```bash
npm install
cp .env.example .env.local
# add your ANTHROPIC_API_KEY to .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Running without an API key

If `ANTHROPIC_API_KEY` is not set, the app automatically runs in **demo mode**: every "Analyze a profile" click (and the "Try the demo profile" button) returns a pre-written, clearly-labeled example result (a fictional profile, fictional evidence, `example.com` source links) so you can see the full product experience — loading states, score gauge, claim cards, sharing — without any setup or API spend.

### Environment variables

| Variable | Required | Default | Description |
| --- | --- | --- | --- |
| `ANTHROPIC_API_KEY` | For real analyses | — | Your Anthropic API key. Without it, the app runs in demo mode. |
| `ANTHROPIC_MODEL` | No | `claude-opus-5` | Model used for both extraction and research/scoring calls. Swap in `claude-sonnet-5` or `claude-haiku-4-5` for a cheaper/faster pipeline. |

See `.env.example`.

## Project structure

```
src/
  app/
    page.tsx                 Homepage: hero, input form, how-it-works
    r/[id]/page.tsx           Shareable results page
    api/analyze/route.ts      POST { input } -> runs the full pipeline, returns { id }
    api/example/route.ts      POST -> seeds/returns the demo result id
  components/                 UI building blocks (form, gauge, claim cards, etc.)
  lib/
    pipeline.ts                Orchestrates extract -> research -> score
    anthropic-client.ts        Anthropic client + structured-output helper
    prompts.ts                 System/user prompts for both LLM calls
    schemas.ts                 JSON schemas enforced via structured outputs
    scoring.ts                 Deterministic Lying Ass Index formula
    fetch-profile.ts           Best-effort URL fetch + input-type detection
    demo.ts                    Fictional demo profile + pre-written result
    store.ts                   In-memory result store keyed by id
    types.ts                   Shared types
```

## Notes & limitations (MVP)

- **LinkedIn scraping**: LinkedIn blocks unauthenticated access to almost all profile pages. When a URL is pasted, the app makes a best-effort fetch and falls back gracefully — the research step's web search can still often find public information about the person/company even when the profile page itself can't be read. For best accuracy, paste the profile's About/Experience text directly instead of just the URL.
- **Persistence**: results are stored in memory and are lost on server restart. Good enough for a demo/single-instance deployment; add a real database for durable shareable links in production.
- **Not a background-check tool**: this is built for entertainment and healthy skepticism, not hiring decisions, harassment, or doxxing. Please use it responsibly.
