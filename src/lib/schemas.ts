export const CLAIM_CATEGORIES = [
  "title",
  "experience",
  "achievement",
  "metric",
  "leadership",
  "education",
  "other",
] as const;

export const extractionSchema = {
  type: "object",
  properties: {
    profileName: {
      type: "string",
      description: "The person's full name as it appears on the profile. If unknown, use 'This person'.",
    },
    headline: {
      type: "string",
      description: "The person's LinkedIn headline or a one-line summary of their claimed role.",
    },
    claims: {
      type: "array",
      description: "Every discrete, checkable claim made in the profile.",
      items: {
        type: "object",
        properties: {
          category: { type: "string", enum: CLAIM_CATEGORIES as unknown as string[] },
          text: {
            type: "string",
            description: "The claim stated plainly and completely, in third person, so it can be checked standalone.",
          },
          searchHints: {
            type: "array",
            items: { type: "string" },
            description: "1-3 short search queries that would help verify this specific claim.",
          },
        },
        required: ["category", "text", "searchHints"],
        additionalProperties: false,
      },
    },
  },
  required: ["profileName", "headline", "claims"],
  additionalProperties: false,
} as const;

export const researchSchema = {
  type: "object",
  properties: {
    overallSummary: {
      type: "string",
      description:
        "One or two sentences, funny but fair, summarizing how this profile holds up against public evidence.",
    },
    claims: {
      type: "array",
      items: {
        type: "object",
        properties: {
          text: { type: "string", description: "Must exactly match one of the input claim texts." },
          category: { type: "string", enum: CLAIM_CATEGORIES as unknown as string[] },
          status: { type: "string", enum: ["supported", "unverified", "contradicted"] },
          confidence: {
            type: "integer",
            description: "0-100, how confident you are in the status given the evidence found.",
          },
          reasoning: {
            type: "string",
            description: "1-3 sentences explaining the verdict, referencing the evidence. Can be witty, must be accurate.",
          },
          evidence: {
            type: "array",
            items: {
              type: "object",
              properties: {
                snippet: { type: "string", description: "Short quote or paraphrase from the source." },
                url: { type: "string", description: "The exact source URL from search results. Never invent a URL." },
                sourceTitle: { type: "string" },
                supports: {
                  type: "boolean",
                  description: "true if this evidence supports the claim, false if it contradicts it.",
                },
              },
              required: ["snippet", "url", "sourceTitle", "supports"],
              additionalProperties: false,
            },
          },
        },
        required: ["text", "category", "status", "confidence", "reasoning", "evidence"],
        additionalProperties: false,
      },
    },
  },
  required: ["overallSummary", "claims"],
  additionalProperties: false,
} as const;
