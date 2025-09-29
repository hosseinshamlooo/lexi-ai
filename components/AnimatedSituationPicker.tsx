"use client";

import { useMemo, useState } from "react";
import { IconArrowLeft, IconArrowRight } from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import StartCall from "./StartCall";

type Situation = {
  role: string;
  description: string;
  image: string;
};

type HeroData = {
  title: string;
  situations: Situation[];
};

export default function Hero({
  apiKey,
  voice,
  data,
}: {
  apiKey: string;
  voice?: string;
  data: HeroData;
}) {
  const [active, setActive] = useState(0);

  const randomStyles = useMemo(
    () =>
      data.situations.map(() => ({
        rotate: Math.floor(Math.random() * 21 - 10),
        x: Math.floor(Math.random() * 40 - 20),
        y: Math.floor(Math.random() * 40 - 20),
      })),
    [data.situations]
  );

  const handleNext = () =>
    setActive((prev) => (prev + 1) % data.situations.length);
  const handlePrev = () =>
    setActive(
      (prev) => (prev - 1 + data.situations.length) % data.situations.length
    );

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-[var(--color-background)] text-[var(--color-foreground)] overflow-hidden px-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start w-full max-w-6xl">
        {/* Left: Image Stack */}
        <div className="relative flex items-center justify-center">
          <div className="relative w-[420px] h-[420px]">
            {data.situations.map((situation, index) => {
              const { rotate, x, y } = randomStyles[index];
              const isActive = index === active;
              return (
                <img
                  key={situation.image}
                  src={situation.image}
                  alt={situation.role}
                  className={`absolute top-0 left-0 w-[420px] h-[420px] object-cover aspect-square rounded-2xl shadow-xl transition-transform duration-300 ${
                    isActive ? "z-50 scale-105" : "z-10 opacity-70"
                  }`}
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
          {/* Animated Title */}
          <AnimatePresence mode="wait">
            <motion.h1
              key={data.title + active} // animate on active change
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="text-5xl font-extrabold whitespace-nowrap"
            >
              {data.title}
            </motion.h1>
          </AnimatePresence>

          {/* Active Role & Description */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <h2 className="text-xl font-semibold mb-2">
                {data.situations[active].role}
              </h2>

              <p className="text-base text-gray-600 dark:text-gray-300">
                {data.situations[active].description
                  .split(" ")
                  .map((word, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 0, y: 5, filter: "blur(4px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      transition={{ delay: i * 0.03, duration: 0.2 }}
                      className="inline-block mr-[2px]"
                    >
                      {word}
                    </motion.span>
                  ))}
              </p>
            </motion.div>
          </AnimatePresence>

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
