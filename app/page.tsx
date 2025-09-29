"use client";

import { useState } from "react";
import Hero from "@/components/Hero";
import dynamic from "next/dynamic";
import { OpenAIVoiceProvider } from "@/components/OpenAIVoiceProvider";
import translationsJSON from "@/translations.json";
import { Nav } from "@/components/Nav";

const Chat = dynamic(() => import("@/components/Chat"), { ssr: false });

export default function ClientPage({ apiKey }: { apiKey: string }) {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const voice = process.env.NEXT_PUBLIC_OPENAI_VOICE || "onyx";

  const typedTranslations = translationsJSON as Record<
    string,
    {
      title?: string;
      situations: { role: string; description: string; image?: string }[];
    }
  >;

  const currentTranslation = typedTranslations[selectedLanguage];

  return (
    <OpenAIVoiceProvider>
      {/* Pass both props here */}
      <Nav
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />

      <div className="flex flex-col">
        <Hero
          apiKey={apiKey}
          voice={voice}
          situations={currentTranslation.situations}
          title={currentTranslation.title ?? "Hey, I'm Lexi 👋"}
        />
        <Chat apiKey={apiKey} />
      </div>
    </OpenAIVoiceProvider>
  );
}
