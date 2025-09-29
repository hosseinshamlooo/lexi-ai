"use client";

import { useState } from "react";
import { useVoice } from "./OpenAIVoiceProvider";
import StartCall from "./StartCall";
import AnimatedSituationPicker from "./AnimatedSituationPicker";

export default function Hero({
  apiKey,
  voice,
}: {
  apiKey: string;
  voice?: string;
}) {
  const [callClicked, setCallClicked] = useState(false);
  const { status } = useVoice();

  const scrollToChat = () => {
    const chat = document.getElementById("chat-container");
    if (chat) chat.scrollIntoView({ behavior: "smooth" });
  };

  if (callClicked && status.value === "connected") return null;

  const situations = [
    {
      role: "Ordering Food",
      description:
        "Very common daily interaction. Includes asking about ingredients, dietary restrictions, and making requests.",
      image: "/images/lexi-1.jpg",
    },
    {
      role: "Hotel Check-in",
      description:
        "Useful for travelers. Asking about room amenities, check-out, and basic requests.",
      image: "/images/lexi-2.jpg",
    },
    {
      role: "Asking for Directions",
      description: "Essential for navigating cities or public transport.",
      image: "/images/lexi-3.jpg",
    },
    {
      role: "Shopping",
      description:
        "Practice conversations when buying clothes, groceries, or other items.",
      image: "/images/lexi-4.jpg",
    },
    {
      role: "Introducing Yourself",
      description:
        "Build confidence with greetings, small talk, and basic introductions.",
      image: "/images/lexi-5.jpg",
    },
    {
      role: "At the Doctor",
      description:
        "Learn to describe symptoms, understand instructions, and ask questions.",
      image: "/images/lexi-6.jpg",
    },
    {
      role: "At the Airport",
      description: "Check-in, security, boarding, and asking about flights.",
      image: "/images/lexi-7.jpg",
    },
    {
      role: "Making Friends",
      description:
        "Casual conversations, finding common interests, and building connections.",
      image: "/images/lexi-8.jpg",
    },
  ];

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center p-6 bg-[var(--color-background)] text-[var(--color-foreground)] transition-colors duration-500">
      <AnimatedSituationPicker
        situations={situations}
        onCallClick={() => (
          <StartCall
            apiKey={apiKey}
            voice={voice}
            inline
            onClick={() => setCallClicked(true)}
            onConnect={scrollToChat}
          />
        )}
      />
    </section>
  );
}
