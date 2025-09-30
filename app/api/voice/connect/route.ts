import { NextResponse } from "next/server";

export async function POST() {
  try {
    // Just return a greeting; no audio or OpenAI calls needed
    return NextResponse.json({
      greeting: "Hello! Welcome to Lexi's! I'll be your waitress for today. Are you ready to order?",
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to start call" }, { status: 500 });
  }
}
