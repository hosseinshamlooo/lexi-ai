import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    // Check for API key first
    if (!process.env.OPENAI_API_KEY) {
      console.error("❌ OPENAI_API_KEY not configured");
      return NextResponse.json(
        { error: "OpenAI API key not configured" },
        { status: 500 }
      );
    }

    const { transcript, language } = await req.json();

    if (!transcript || !language) {
      return NextResponse.json(
        { error: "Transcript and language are required" },
        { status: 400 }
      );
    }

    console.log(`📝 Analyzing conversation in ${language}...`);

    // Create the analysis prompt based on language
    const systemPrompt = language === "fr" 
      ? `Tu es un assistant qui analyse les conversations d'apprentissage de langues. 
         Analyse cette conversation et fournis:
         1. Un résumé en une phrase qui commence par "Dans cette conversation, vous avez parlé de..."
         2. 3-5 points de récapitulatif des sujets principaux discutés
         
         Réponds en JSON avec cette structure:
         {
           "summary": "Dans cette conversation, vous avez parlé de...",
           "recapPoints": ["Point 1", "Point 2", "Point 3"]
         }`
      : `You are an assistant that analyzes language learning conversations.
         Analyze this conversation and provide:
         1. A one-sentence summary that starts with "In this conversation, you talked about..."
         2. 3-5 recap points of the main topics discussed
         
         Respond in JSON with this structure:
         {
           "summary": "In this conversation, you talked about...",
           "recapPoints": ["Point 1", "Point 2", "Point 3"]
         }`;

    const userPrompt = `Please analyze this conversation transcript:\n\n${transcript}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 300,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.7,
    });

    const rawResponse = response.choices?.[0]?.message?.content || "";
    
    try {
      const analysis = JSON.parse(rawResponse);
      console.log(`✅ Conversation analysis completed`);
      
      return NextResponse.json(analysis);
    } catch (parseError) {
      console.error("❌ Failed to parse GPT response as JSON:", rawResponse);
      
      // Fallback: try to extract summary and create basic recap points
      const fallbackSummary = language === "fr" 
        ? "Dans cette conversation, vous avez eu un échange intéressant."
        : "In this conversation, you had an interesting exchange.";
      
      return NextResponse.json({
        summary: fallbackSummary,
        recapPoints: [
          language === "fr" ? "Échange de conversation" : "Conversation exchange",
          language === "fr" ? "Pratique de la langue" : "Language practice",
          language === "fr" ? "Interaction naturelle" : "Natural interaction"
        ]
      });
    }

  } catch (err: any) {
    console.error("❌ Analyze conversation error:", err);
    return NextResponse.json(
      { error: err.message || "Failed to analyze conversation" },
      { status: 500 }
    );
  }
}
