"use client";

import { useState, useEffect, useContext, useMemo } from "react";
import dynamic from "next/dynamic";
import {
  OpenAIVoiceProvider,
  useVoice,
} from "@/components/OpenAIVoiceProvider";
import { Nav } from "@/components/Nav";
import Hero from "@/components/Hero";
import Controls from "@/components/Controls";
import FeedbackPage from "@/components/FeedbackPage";
import translationsJSON from "@/translations.json";
import { toast } from "sonner";

const Chat = dynamic(() => import("@/components/Chat"), { ssr: false });

function ClientPageContent({
  selectedLanguage,
  setSelectedLanguage,
}: {
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
}) {
  const { messages } = useVoice();
  const [callStarted, setCallStarted] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isLoadingFeedback, setIsLoadingFeedback] = useState(false);
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

  // Generate conversation history for nav dropdown
  const conversationHistory = useMemo(() => {
    if (!activeSituation) return [];

    const getSituationTitle = (situation: any, lang: string) => {
      if (
        situation.description?.toLowerCase().includes("food") ||
        situation.prompt?.toLowerCase().includes("food") ||
        situation.role?.toLowerCase().includes("food")
      ) {
        return lang === "fr" ? "Commander de la nourriture" : "Ordering food";
      }
      if (
        situation.description?.toLowerCase().includes("university") ||
        situation.prompt?.toLowerCase().includes("university")
      ) {
        return lang === "fr"
          ? "Vie universitaire et liberté d'expression"
          : "University life and free speech";
      }
      if (situation.description?.toLowerCase().includes("environment")) {
        return lang === "fr"
          ? "Stratégies de conservation environnementale"
          : "Environmental conservation strategies";
      }
      if (situation.description?.toLowerCase().includes("marketing")) {
        return lang === "fr"
          ? "Tendances du marketing numérique 2024"
          : "Digital marketing trends 2024";
      }
      return lang === "fr" ? situation.role : situation.role;
    };

    return [
      {
        id: "1",
        title: getSituationTitle(activeSituation, selectedLanguage),
        date: "Today, 2:30 PM",
        situation: activeSituation,
      },
      {
        id: "2",
        title:
          selectedLanguage === "fr"
            ? "Stratégies de conservation environnementale"
            : "Environmental conservation strategies",
        date: "Yesterday, 4:15 PM",
        situation: {
          role: "Environmental Scientist",
          description: "Discussing climate change solutions",
          greeting: "Hello! Let's talk about the environment.",
          prompt:
            "As an environmental scientist, discuss conservation strategies.",
        },
      },
      {
        id: "3",
        title:
          selectedLanguage === "fr"
            ? "Tendances du marketing numérique 2024"
            : "Digital marketing trends 2024",
        date: "Dec 18, 11:20 AM",
        situation: {
          role: "Marketing Expert",
          description: "Exploring modern marketing techniques",
          greeting: "Hi! Ready to discuss marketing?",
          prompt: "Share insights about digital marketing trends for 2024.",
        },
      },
    ];
  }, [activeSituation, selectedLanguage]);

  const [currentConversation, setCurrentConversation] = useState(
    conversationHistory[0] || null
  );

  // Update current conversation when conversationHistory changes
  useEffect(() => {
    if (conversationHistory.length > 0) {
      setCurrentConversation(conversationHistory[0]);
    }
  }, [conversationHistory]);

  // Handle loading transition when feedback is shown
  useEffect(() => {
    if (showFeedback && activeSituation && isLoadingFeedback) {
      // Simulate data loading delay
      const timer = setTimeout(() => {
        setIsLoadingFeedback(false);
      }, 2000); // 2 second loading delay

      return () => clearTimeout(timer);
    }
  }, [showFeedback, activeSituation, isLoadingFeedback]);

  return (
    <>
      <Nav
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        showFeedback={showFeedback}
        conversationHistory={conversationHistory}
        currentConversation={currentConversation}
        onConversationChange={setCurrentConversation}
      />

      {/* Show feedback page if call ended */}
      {showFeedback && activeSituation ? (
        <FeedbackPage
          onBack={() => {
            setShowFeedback(false);
            setActiveSituation(null);
            setIsLoadingFeedback(false);
            // scroll back to Hero smoothly
            const hero = document.getElementById("hero");
            hero?.scrollIntoView({ behavior: "smooth" });
          }}
          language={selectedLanguage}
          situation={activeSituation}
          isLoading={isLoadingFeedback}
          userMessages={messages}
          currentConversation={currentConversation}
        />
      ) : (
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
                  setIsLoadingFeedback(true);
                  setShowFeedback(true);
                  // Keep activeSituation for feedback page
                }}
              />
            </>
          )}
        </div>
      )}
    </>
  );
}

export default function ClientPage() {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  return (
    <OpenAIVoiceProvider
      language={selectedLanguage}
      onError={(err) => toast.error(`Call error: ${err.message}`)}
    >
      <ClientPageContent
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />
    </OpenAIVoiceProvider>
  );
}
