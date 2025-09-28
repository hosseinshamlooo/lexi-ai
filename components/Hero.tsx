"use client";
import { motion } from "motion/react";
import StartCall from "./StartCall";
import { useVoice } from "./OpenAIVoiceProvider";
import { useState } from "react";

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

  // Hide Hero only after voice connection is active
  const hideHero = callClicked && status.value === "connected";
  if (hideHero) return null;

  return (
    <section
      className="
        relative w-full min-h-screen flex flex-col items-center justify-center
        p-6
        bg-[var(--color-background)]
        text-[var(--color-foreground)]
        transition-colors duration-500
      "
    >
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-5xl font-bold mb-4 text-center"
      >
        Hiya👋 I'm Lexi
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="text-lg mb-8 text-center max-w-xl"
      >
        Your personal AI-powered language partner. Start speaking today!
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        <StartCall
          apiKey={apiKey}
          voice={voice}
          inline
          onClick={() => setCallClicked(true)}
          onConnect={scrollToChat}
        />
      </motion.div>
    </section>
  );
}
