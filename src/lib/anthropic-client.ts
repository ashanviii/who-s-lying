import Anthropic from "@anthropic-ai/sdk";
import type { MessageCreateParamsNonStreaming } from "@anthropic-ai/sdk/resources/messages";

let client: Anthropic | null = null;

export function isLlmConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

export function getClient(): Anthropic {
  if (!client) {
    client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
  }
  return client;
}

export const MODEL = process.env.ANTHROPIC_MODEL?.trim() || "claude-opus-5";

export class LlmError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = "LlmError";
  }
}

/**
 * Runs a single Messages API call constrained to a JSON schema via structured
 * outputs, and returns the parsed JSON. Optionally accepts extra params
 * (e.g. tools) to merge in, so the same helper covers both the plain
 * extraction call and the web-search-enabled research call.
 */
export async function runStructured<T>(params: {
  system: string;
  user: string;
  schema: Record<string, unknown>;
  maxTokens?: number;
  effort?: "low" | "medium" | "high" | "xhigh" | "max";
  extra?: Partial<MessageCreateParamsNonStreaming>;
}): Promise<T> {
  const anthropic = getClient();

  let response;
  try {
    response = await anthropic.messages.create({
      model: MODEL,
      max_tokens: params.maxTokens ?? 8000,
      system: params.system,
      messages: [{ role: "user", content: params.user }],
      output_config: {
        effort: params.effort ?? "medium",
        format: { type: "json_schema", schema: params.schema },
      },
      ...params.extra,
    });
  } catch (err) {
    if (err instanceof Anthropic.AuthenticationError) {
      throw new LlmError("Invalid or missing ANTHROPIC_API_KEY.", err);
    }
    if (err instanceof Anthropic.RateLimitError) {
      throw new LlmError("The analysis engine is rate-limited right now. Try again in a moment.", err);
    }
    if (err instanceof Anthropic.APIError) {
      throw new LlmError(`Analysis engine error (${err.status}): ${err.message}`, err);
    }
    throw new LlmError("Failed to reach the analysis engine.", err);
  }

  if (response.stop_reason === "refusal") {
    throw new LlmError(
      "The analysis engine declined to process this profile. Try rephrasing or shortening the input.",
    );
  }

  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock || textBlock.type !== "text") {
    throw new LlmError("The analysis engine returned no usable output.");
  }

  try {
    return JSON.parse(textBlock.text) as T;
  } catch (err) {
    throw new LlmError("The analysis engine returned malformed JSON.", err);
  }
}
