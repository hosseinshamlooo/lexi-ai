import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// In-memory store (replace with DB/Redis in production)
let conversationHistory: { role: "user" | "assistant"; content: string }[] = [];
let conversationSummary: string | null = null;

// Utility to clean text for TTS
function cleanForTTS(text: string): string {
  return text
    .replace(/[*_#`]/g, "") // strip markdown
    .replace(/\s+/g, " ")   // collapse multiple spaces
    .trim();
}

// Summarize older messages to keep history short
async function summarizeHistory() {
  if (conversationHistory.length < 6) return; // only summarize if long

  const summaryPrompt = `
  Summarize this conversation briefly, keeping key facts, requests, and context:
  ${conversationHistory.map(m => `${m.role}: ${m.content}`).join("\n")}
  `;

  const summaryResp = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    max_tokens: 120,
    messages: [
      { role: "system", content: "You are a summarizer." },
      { role: "user", content: summaryPrompt },
    ],
  });

  conversationSummary =
    summaryResp.choices[0].message?.content?.trim() || conversationSummary;

  // Clear old history but keep last exchange for continuity
  conversationHistory = conversationHistory.slice(-2);
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("file") as File | null;
    const language = (formData.get("language") as string) || "en";
    const prompt =
      (formData.get("prompt") as string) ||
      `You are a helpful assistant. Keep responses conversational, short (max 3 sentences), and in the user's language (${language}).`;

    if (!audioFile) {
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    // === Transcribe audio with Whisper ===
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language,
    });

    const userText = transcription.text || "";
    conversationHistory.push({ role: "user", content: userText });

    // Summarize if history is too long
    await summarizeHistory();

    // === Chat completion ===
    const messages: { role: "system" | "user" | "assistant"; content: string }[] = [];

    // System prompt only once
    messages.push({ role: "system", content: prompt });

    // If we have a summary, include it as context
    if (conversationSummary) {
      messages.push({
        role: "assistant",
        content: `Summary of previous conversation: ${conversationSummary}`,
      });
    }

    // Add current history
    messages.push(...conversationHistory);

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 120,
      messages,
    });

    const rawResponse = chatResponse.choices?.[0]?.message?.content || "";
    const cleanResponse = cleanForTTS(rawResponse);

    conversationHistory.push({ role: "assistant", content: cleanResponse });

    return NextResponse.json({
      text: userText,
      response: cleanResponse,
    });
  } catch (err: any) {
    console.error("❌ Process route error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process audio" },
      { status: 500 }
    );
  }
}
