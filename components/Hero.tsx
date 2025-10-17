"use client";

import { useMemo, useState } from "react";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import StartCall from "./StartCall";

export type Situation = {
  role: string;
  description: string;
  greeting: string; // Assistant greeting for this situation
  prompt: string; // AI prompt / context for this situation
  image?: string;
};

interface HeroProps {
  situations: Situation[];
  title: string;
  voice?: string;
  language?: string;
  onStartCall?: (situation: Situation) => void;
}

export default function Hero({
  situations,
  title,
  voice,
  language = "en",
  onStartCall,
}: HeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const randomStyles = useMemo(
    () =>
      situations.map(() => ({
        rotate: Math.floor(Math.random() * 21 - 10),
        x: Math.floor(Math.random() * 40 - 20),
        y: Math.floor(Math.random() * 40 - 20),
      })),
    [situations]
  );

  const handleNext = () =>
    setActiveIndex((prev) => (prev + 1) % situations.length);
  const handlePrev = () =>
    setActiveIndex(
      (prev) => (prev - 1 + situations.length) % situations.length
    );

  const activeSituation = situations[activeIndex];

  return (
    <section
      id="hero"
      className="relative w-full min-h-screen flex items-center justify-center bg-[var(--color-background)] text-[var(--color-foreground)] overflow-hidden px-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start w-full max-w-6xl">
        {/* Left: Image Stack */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-[420px] h-[420px]">
            {situations.map((situation, index) => {
              const { rotate, x, y } = randomStyles[index];
              const isActive = index === activeIndex;

              return (
                <img
                  key={situation.image ?? index}
                  src={situation.image || `/images/lexi-${index + 1}.jpg`}
                  alt={situation.role}
                  className={`absolute top-0 left-0 w-[420px] h-[420px] object-cover aspect-square rounded-2xl shadow-xl transition-transform duration-300 ${
                    isActive ? "z-50 scale-105" : "z-10 opacity-70"
                  }`}
                  style={{
                    transform: `translate(${x}px, ${y}px) rotate(${
                      isActive ? 0 : rotate
                    }deg)`,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Right: Text, StartCall, Navigation */}
        <div className="flex flex-col items-start text-left max-w-md space-y-4 mt-16">
          <h1 className="text-5xl font-extrabold whitespace-nowrap">{title}</h1>

          <div>
            <h2 className="text-2xl font-semibold mb-2">
              {activeSituation.role}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {activeSituation.description}
            </p>
          </div>

          <StartCall
            inline
            voice={voice}
            onClick={() => onStartCall?.(activeSituation)}
          />

          <div className="flex gap-4 mt-4">
            <button
              onClick={handlePrev}
              className="group/button flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800"
            >
              <IconArrowLeft className="h-6 w-6 text-black dark:text-neutral-400 group-hover/button:scale-110 transition-transform" />
            </button>
            <button
              onClick={handleNext}
              className="group/button flex h-10 w-10 items-center justify-center rounded-full bg-gray-100 dark:bg-neutral-800"
            >
              <IconArrowRight className="h-6 w-6 text-black dark:text-neutral-400 group-hover/button:scale-110 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
