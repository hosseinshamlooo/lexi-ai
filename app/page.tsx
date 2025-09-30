"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { OpenAIVoiceProvider } from "@/components/OpenAIVoiceProvider";
import { Nav } from "@/components/Nav";
import Hero from "@/components/Hero";
import Controls from "@/components/Controls";
import translationsJSON from "@/translations.json";
import { toast } from "sonner";

const Chat = dynamic(() => import("@/components/Chat"), { ssr: false });

export default function ClientPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [callStarted, setCallStarted] = useState(false);

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
    <OpenAIVoiceProvider
      language={selectedLanguage}
      onError={(err) => toast.error(`Call error: ${err.message}`)}
    >
      <Nav
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />

      <div className="flex flex-col w-full">
        {/* Hero section: only show if call has NOT started */}
        {!callStarted && (
          <Hero
            voice={voice}
            situations={currentTranslation.situations}
            title={currentTranslation.title ?? "Hey, I'm Lexi 👋"}
            onStartCall={() => setCallStarted(true)}
          />
        )}

        {/* Chat + Controls: only show when call is active */}
        {callStarted && (
          <>
            <Chat />
            <Controls
              onEndCall={() => {
                setCallStarted(false); // reset call state in page
                // scroll back to Hero smoothly
                const hero = document.getElementById("hero");
                hero?.scrollIntoView({ behavior: "smooth" });
              }}
            />
          </>
        )}
      </div>
    </OpenAIVoiceProvider>
  );
}
