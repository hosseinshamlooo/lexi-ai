"use client";

import { useMemo, useState } from "react";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import StartCall from "./StartCall";

type Situation = {
  role: string;
  description: string;
  image: string;
};

export default function Hero({
  apiKey,
  voice,
  situations,
}: {
  apiKey: string;
  voice?: string;
  situations: Situation[];
}) {
  const [active, setActive] = useState(0);

  const randomStyles = useMemo(
    () =>
      situations.map(() => ({
        rotate: Math.floor(Math.random() * 21 - 10), // random tilt -10° to +10°
        x: Math.floor(Math.random() * 40 - 20), // -20px to +20px
        y: Math.floor(Math.random() * 40 - 20),
      })),
    [situations]
  );

  const handleNext = () => setActive((prev) => (prev + 1) % situations.length);
  const handlePrev = () =>
    setActive((prev) => (prev - 1 + situations.length) % situations.length);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-[var(--color-background)] text-[var(--color-foreground)] overflow-hidden px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start w-full max-w-6xl">
        {/* Left: Messy Image Stack */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-[420px] h-[420px]">
            {situations.map((situation, index) => {
              const { rotate, x, y } = randomStyles[index];
              const isActive = index === active;
              return (
                <img
                  key={situation.image}
                  src={situation.image}
                  alt={situation.role}
                  className={`
                    absolute top-0 left-0 
                    w-[420px] h-[420px] 
                    object-cover aspect-square 
                    rounded-2xl shadow-xl
                    transition-transform duration-300
                    ${isActive ? "z-50 scale-105" : "z-10 opacity-70"}
                  `}
                  style={{
                    transform: `translate(${x}px, ${y}px) rotate(${rotate}deg)`,
                  }}
                />
              );
            })}
          </div>
        </div>

        {/* Right: Text, StartCall, Arrows */}
        <div className="flex flex-col items-start text-left max-w-md space-y-4">
          {/* Static Title */}
          <h1 className="text-5xl font-extrabold whitespace-nowrap">
            Hey I’m Lexi 👋
          </h1>

          {/* Active Role & Description */}
          <div>
            <h2 className="text-2xl font-semibold mb-2">
              {situations[active].role}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              {situations[active].description}
            </p>
          </div>

          {/* Start Call Button */}
          <StartCall apiKey={apiKey} voice={voice} inline />

          {/* Arrows */}
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
