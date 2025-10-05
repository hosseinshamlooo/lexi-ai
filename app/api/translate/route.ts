// app/api/translate/route.ts
import { NextResponse } from "next/server";

type LingvaResponse = { translation: string };

const translationCache = new Map<string, string>();

export async function POST(req: Request) {
  try {
    const { text, sourceLang = "fr", targetLang = "en" } = (await req.json()) as {
      text: string;
      sourceLang?: string;
      targetLang?: string;
    };

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Invalid text" }, { status: 400 });
    }

    // Use cache for full sentence
    let translatedText = translationCache.get(text);
    if (!translatedText) {
      try {
        const res = await fetch(
          `https://lingva.ml/api/v1/${sourceLang}/${targetLang}/${encodeURIComponent(text)}`
        );
        const data: LingvaResponse = await res.json();
        translatedText = data.translation ?? text; // fallback if undefined
        translationCache.set(text, translatedText);
      } catch (err) {
        console.error("Lingva error:", err);
        translatedText = text;
        translationCache.set(text, translatedText);
      }
    }

    // Word-level mapping for hover
    const originalWords = text.split(/\s+/);
    const translatedWords = translatedText.split(/\s+/);

    const translations: Record<string, string> = {};
    originalWords.forEach((w, i) => {
      const clean = w.replace(/[.,!?;:"'()]/g, "").toLowerCase();
      translations[clean] = translatedWords[i] ?? w;
    });

    return NextResponse.json({ translations, translatedText });
  } catch (err) {
    console.error("Translation route error:", err);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
