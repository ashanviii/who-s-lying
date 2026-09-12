import OpenAI from "openai";
import type { WebSearchTool } from "openai/resources/responses/responses";

let client: OpenAI | null = null;

export function isLlmConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

export function getClient(): OpenAI {
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
}

export const MODEL = process.env.OPENAI_MODEL?.trim() || "gpt-5";

export const WEB_SEARCH_TOOL: WebSearchTool = { type: "web_search" };

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
 * Runs a single Responses API call constrained to a JSON schema via
 * structured outputs, and returns the parsed JSON. Optionally accepts tools
 * (e.g. the hosted web_search tool) so the same helper covers both the plain
 * extraction call and the web-search-enabled research call - OpenAI executes
 * hosted tools server-side, so this is still a single request/response.
 */
export async function runStructured<T>(params: {
  system: string;
  user: string;
  schema: Record<string, unknown>;
  schemaName: string;
  tools?: WebSearchTool[];
  reasoningEffort?: "minimal" | "low" | "medium" | "high";
}): Promise<T> {
  const openai = getClient();

  let response;
  try {
    response = await openai.responses.create({
      model: MODEL,
      instructions: params.system,
      input: params.user,
      tools: params.tools,
      reasoning: params.reasoningEffort ? { effort: params.reasoningEffort } : undefined,
      text: {
        format: {
          type: "json_schema",
          name: params.schemaName,
          schema: params.schema,
          strict: true,
        },
      },
    });
  } catch (err) {
    if (err instanceof OpenAI.AuthenticationError) {
      throw new LlmError("Invalid or missing OPENAI_API_KEY.", err);
    }
    if (err instanceof OpenAI.RateLimitError) {
      throw new LlmError("The analysis engine is rate-limited or out of credits right now. Try again in a moment.", err);
    }
    if (err instanceof OpenAI.APIError) {
      throw new LlmError(`Analysis engine error (${err.status}): ${err.message}`, err);
    }
    throw new LlmError("Failed to reach the analysis engine.", err);
  }

  if (response.status === "incomplete") {
    throw new LlmError(
      `The analysis engine stopped early (${response.incomplete_details?.reason ?? "unknown reason"}).`,
    );
  }

  const text = response.output_text;
  if (!text) {
    throw new LlmError("The analysis engine returned no usable output.");
  }

  try {
    return JSON.parse(text) as T;
  } catch (err) {
    throw new LlmError("The analysis engine returned malformed JSON.", err);
  }
}
