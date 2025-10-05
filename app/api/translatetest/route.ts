// app/api/translatetest/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  const text = "Je m'appelle Hossein.";

  try {
    const res = await fetch(
      `https://lingva.ml/api/v1/fr/en/${encodeURIComponent(text)}`
    );
    const data = await res.json();
    return NextResponse.json({ translated: data.translation });
  } catch (err) {
    console.error("Lingva error:", err);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
