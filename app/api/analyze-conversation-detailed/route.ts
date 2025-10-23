import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OpenAI API key not configured." },
        { status: 500 }
      );
    }

    const { transcript, language } = await req.json();

    if (!transcript) {
      return NextResponse.json(
        { error: "No transcript provided" },
        { status: 400 }
      );
    }

    const systemPrompt =
      language === "fr"
        ? `Vous êtes un assistant utile qui analyse les conversations et fournit des résumés détaillés. Analysez la conversation et fournissez:
1. Un résumé d'une phrase de la conversation
2. 3-5 sujets principaux discutés, chacun avec 2-3 points détaillés

Format de réponse:
Summary: [résumé d'une phrase]
Topics:
1. [Titre du sujet]
   - [Point 1]
   - [Point 2]
   - [Point 3]

2. [Titre du sujet]
   - [Point 1]
   - [Point 2]
   - [Point 3]

etc.`
        : `You are a helpful assistant that analyzes conversations and provides detailed summaries. Analyze the conversation and provide:
1. A one-sentence summary of the conversation
2. 3-5 main topics discussed, each with 2-3 detailed points

Response format:
Summary: [one-sentence summary]
Topics:
1. [Topic title]
   - [Point 1]
   - [Point 2]
   - [Point 3]

2. [Topic title]
   - [Point 1]
   - [Point 2]
   - [Point 3]

etc.`;

    const userPrompt = `Conversation Transcript:\n${transcript}\n\nBased on the above conversation, provide a detailed analysis with summary and topics.`;

    const chatResponse = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      max_tokens: 1000,
    });

    const content = chatResponse.choices[0].message?.content || "";

    // Parse the content to extract summary and topics
    const summaryMatch = content.match(/Summary:\s*(.*?)(\n|$)/i);
    const topicsMatch = content.match(/Topics:\s*([\s\S]*)/i);

    const summary = summaryMatch ? summaryMatch[1].trim() : "";

    let topics: Array<{ title: string; points: string[] }> = [];
    if (topicsMatch) {
      const topicsText = topicsMatch[1];
      const topicSections = topicsText.split(/\d+\.\s+/).filter(section => section.trim());
      
      topics = topicSections.map(section => {
        const lines = section.trim().split('\n');
        const title = lines[0].trim();
        const points = lines
          .slice(1)
          .map(line => line.replace(/^-\s*/, '').trim())
          .filter(point => point.length > 0);
        
        return { title, points };
      });
    }

    return NextResponse.json({ summary, topics });
  } catch (error: any) {
    console.error("API route error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze conversation" },
      { status: 500 }
    );
  }
}
