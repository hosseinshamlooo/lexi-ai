import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Just return a greeting; no audio or OpenAI calls needed
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to start call" }, { status: 500 });
  }
}
