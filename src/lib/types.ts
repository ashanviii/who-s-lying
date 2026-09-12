export type ClaimCategory =
  | "title"
  | "experience"
  | "achievement"
  | "metric"
  | "leadership"
  | "education"
  | "other";

export type ClaimStatus = "supported" | "unverified" | "contradicted";

export interface Evidence {
  snippet: string;
  url: string;
  sourceTitle?: string;
  supports: boolean;
}

export interface ExtractedClaim {
  category: ClaimCategory;
  text: string;
  searchHints?: string[];
}

export interface ExtractionResult {
  profileName: string;
  headline: string;
  claims: ExtractedClaim[];
}

export interface ScoredClaim {
  id: string;
  category: ClaimCategory;
  text: string;
  status: ClaimStatus;
  confidence: number;
  reasoning: string;
  evidence: Evidence[];
}

export interface ResearchResult {
  overallSummary: string;
  claims: ScoredClaim[];
}

export interface ScoreBreakdown {
  index: number;
  label: string;
  labelEmoji: string;
  checkablePercent: number;
  counts: {
    supported: number;
    unverified: number;
    contradicted: number;
  };
}

export interface AnalysisResult {
  id: string;
  createdAt: string;
  demo: boolean;
  inputType: "url" | "text";
  profileName: string;
  headline: string;
  overallSummary: string;
  score: ScoreBreakdown;
  claims: ScoredClaim[];
  disclaimer: string;
  sourceNote?: string;
}

export interface AnalyzeRequestBody {
  input: string;
}

export interface ApiErrorBody {
  error: string;
}
