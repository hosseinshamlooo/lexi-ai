"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { OpenAIVoiceProvider } from "@/components/OpenAIVoiceProvider";
import { Nav } from "@/components/Nav";
import Hero from "@/components/Hero";
import Controls from "@/components/Controls";
import FeedbackPage from "@/components/FeedbackPage";
import translationsJSON from "@/translations.json";
import { toast } from "sonner";

const Chat = dynamic(() => import("@/components/Chat"), { ssr: false });

export default function ClientPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");
  const [callStarted, setCallStarted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [activeSituation, setActiveSituation] = useState<null | {
    role: string;
    description: string;
    greeting: string;
    prompt: string;
    image?: string;
  }>(null);

  const voice = process.env.NEXT_PUBLIC_OPENAI_VOICE || "onyx";

  const typedTranslations = translationsJSON as Record<
    string,
    {
      title?: string;
      situations: {
        role: string;
        description: string;
        greeting: string;
        prompt: string;
        image?: string;
      }[];
    }
  >;

  const currentTranslation = typedTranslations[selectedLanguage];

  // Show feedback page if call ended
  if (showFeedback && activeSituation) {
    return (
      <FeedbackPage
        onBack={() => {
          setShowFeedback(false);
          setActiveSituation(null);
          // scroll back to Hero smoothly
          const hero = document.getElementById("hero");
          hero?.scrollIntoView({ behavior: "smooth" });
        }}
        language={selectedLanguage}
        situation={activeSituation}
      />
    );
  }

  return (
    <OpenAIVoiceProvider
      language={selectedLanguage}
      onError={(err) => toast.error(`Call error: ${err.message}`)}
    >
      <Nav
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        showFeedback={showFeedback}
      />

      <div className="flex flex-col w-full">
        {/* Hero section: only show if call has NOT started */}
        {!callStarted && (
          <Hero
            voice={voice}
            situations={currentTranslation.situations}
            title={currentTranslation.title ?? "Hey, I'm Lexi 👋"}
            onStartCall={(situation) => {
              setActiveSituation(situation);
              setCallStarted(true);
            }}
          />
        )}

        {/* Chat + Controls: only show when call is active */}
        {callStarted && activeSituation && (
          <>
            <Chat
              greeting={activeSituation.greeting}
              prompt={activeSituation.prompt}
            />
            <Controls
              onEndCall={() => {
                setCallStarted(false);
                setShowFeedback(true);
                // Keep activeSituation for feedback page
              }}
            />
          </>
        )}
      </div>
    </OpenAIVoiceProvider>
  );
}
