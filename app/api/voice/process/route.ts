// /app/api/voice/process/route.ts
import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get("file") as File | null;

    if (!audioFile) {
      console.error("❌ No audio file in formData");
      return NextResponse.json(
        { error: "No audio file provided" },
        { status: 400 }
      );
    }

    console.log("📦 Got audio file:", audioFile.name, audioFile.size, audioFile.type);

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    // Whisper transcription
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: "whisper-1",
      language: "en",
    });

    const userText = transcription.text || "";

    // GPT reply
    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are a waitress at a restaurant helping the user practice their English." },
        { role: "user", content: userText },
      ],
    });

    const responseText = chatResponse.choices?.[0]?.message?.content || "";

    return NextResponse.json({ text: userText, response: responseText });
  } catch (err: any) {
    console.error("❌ Process route error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to process audio" },
      { status: 500 }
    );
  }
}
