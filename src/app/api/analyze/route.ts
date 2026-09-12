import { NextRequest, NextResponse } from "next/server";
import { isLlmConfigured, LlmError } from "@/lib/anthropic-client";
import { buildDemoResult, DEMO_ID } from "@/lib/demo";
import { analyzeProfile, PipelineError } from "@/lib/pipeline";
import { saveResult } from "@/lib/store";
import type { AnalyzeRequestBody } from "@/lib/types";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  let body: AnalyzeRequestBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const input = typeof body.input === "string" ? body.input : "";

  if (!isLlmConfigured()) {
    saveResult(buildDemoResult());
    return NextResponse.json({ id: DEMO_ID, demo: true });
  }

  try {
    const result = await analyzeProfile(input);
    saveResult(result);
    return NextResponse.json({ id: result.id, demo: false });
  } catch (err) {
    if (err instanceof PipelineError) {
      return NextResponse.json({ error: err.message }, { status: err.status });
    }
    if (err instanceof LlmError) {
      return NextResponse.json({ error: err.message }, { status: 502 });
    }
    console.error("analyze failed", err);
    return NextResponse.json({ error: "Something went wrong while analyzing that profile." }, { status: 500 });
  }
}
