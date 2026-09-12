import { NextResponse } from "next/server";
import { buildDemoResult, DEMO_ID } from "@/lib/demo";
import { saveResult } from "@/lib/store";

export async function POST() {
  saveResult(buildDemoResult());
  return NextResponse.json({ id: DEMO_ID, demo: true });
}
