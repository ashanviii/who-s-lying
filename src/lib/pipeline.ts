import { nanoid } from "nanoid";
import { runStructured, WEB_SEARCH_TOOL } from "./llm-client";
import { detectInputType, fetchUrlContent } from "./fetch-profile";
import {
  buildExtractionUserPrompt,
  buildResearchUserPrompt,
  EXTRACTION_SYSTEM_PROMPT,
  RESEARCH_SYSTEM_PROMPT,
} from "./prompts";
import { extractionSchema, researchSchema } from "./schemas";
import { computeScore } from "./scoring";
import type { AnalysisResult, ExtractionResult, ResearchResult, ScoredClaim } from "./types";

export const GENERAL_DISCLAIMER =
  "The Lying Ass Index measures how well a claim could be verified against public sources right now — it is NOT a verdict on whether this person is lying. Plenty of true things leave no public trail, and plenty of public trails are wrong. Read the evidence, use your brain.";

const MAX_CLAIMS = 20;

class PipelineError extends Error {
  constructor(
    message: string,
    public readonly status = 400,
  ) {
    super(message);
  }
}

export { PipelineError };

export async function analyzeProfile(rawInput: string): Promise<AnalysisResult> {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    throw new PipelineError("Paste a LinkedIn URL or some profile text first.");
  }
  if (trimmed.length > 20000) {
    throw new PipelineError("That's a lot of profile. Trim it to under 20,000 characters and try again.");
  }

  const detected = detectInputType(trimmed);
  let extractionInput = detected.value;
  let sourceNote: string | undefined;

  if (detected.type === "url") {
    const fetched = await fetchUrlContent(detected.value);
    if (fetched.ok) {
      extractionInput = `${detected.value}\n\n${fetched.text}`;
    } else {
      sourceNote =
        "LinkedIn blocks automated access to most profiles, so this URL couldn't be fully read. Claims below were extracted from whatever public info could be found — for a much more accurate report, copy the profile's About/Experience text and paste it directly instead of the URL.";
    }
  }

  const extraction = await runStructured<ExtractionResult>({
    system: EXTRACTION_SYSTEM_PROMPT,
    user: buildExtractionUserPrompt(extractionInput, detected.type),
    schema: extractionSchema,
    schemaName: "profile_claims",
    reasoningEffort: "medium",
    tools: [WEB_SEARCH_TOOL],
  });

  if (!extraction.claims || extraction.claims.length === 0) {
    throw new PipelineError(
      "Couldn't find any checkable claims in that input. Try pasting the profile's About and Experience sections directly.",
    );
  }

  const claims = extraction.claims.slice(0, MAX_CLAIMS);

  const research = await runStructured<ResearchResult>({
    system: RESEARCH_SYSTEM_PROMPT,
    user: buildResearchUserPrompt(extraction.profileName, extraction.headline, claims),
    schema: researchSchema,
    schemaName: "claim_verdicts",
    reasoningEffort: "medium",
    tools: [WEB_SEARCH_TOOL],
  });

  const scoredClaims: ScoredClaim[] = research.claims.map((c, i) => ({
    id: `${i}-${nanoid(6)}`,
    category: c.category,
    text: c.text,
    status: c.status,
    confidence: Math.max(0, Math.min(100, Math.round(c.confidence))),
    reasoning: c.reasoning,
    evidence: c.evidence ?? [],
  }));

  const result: AnalysisResult = {
    id: nanoid(10),
    createdAt: new Date().toISOString(),
    demo: false,
    inputType: detected.type,
    profileName: extraction.profileName || "This person",
    headline: extraction.headline || "",
    overallSummary: research.overallSummary,
    score: computeScore(scoredClaims),
    claims: scoredClaims,
    disclaimer: GENERAL_DISCLAIMER,
    sourceNote,
  };

  return result;
}
