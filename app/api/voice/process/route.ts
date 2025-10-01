import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("file") as File | null;
    const language = (formData.get("language") as string) || "en";
    const prompt = (formData.get("prompt") as string) || "";

    if (!audioFile) {
      return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // === Whisper transcription in selected language ===
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language,
    });

    const userText = transcription.text || "";

    // === GPT response using the selected prompt as system message ===
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: prompt || "You are a helpful assistant speaking the user's language." },
        { role: "user", content: userText },
      ],
    });

    const responseText = chatResponse.choices?.[0]?.message?.content || "";

    return NextResponse.json({ text: userText, response: responseText });
  } catch (err: any) {
    console.error("❌ Process route error:", err);
    return NextResponse.json({ error: err.message || "Failed to process audio" }, { status: 500 });
  }
}
