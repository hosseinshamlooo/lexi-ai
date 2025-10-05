"use client";

import { cn } from "@/utils";
import { useVoice } from "./OpenAIVoiceProvider";
import { AnimatePresence, motion } from "motion/react";
import React, { ComponentRef, forwardRef, useState } from "react";

const Messages = forwardRef<
  ComponentRef<typeof motion.div>,
  Record<never, never>
>(function Messages(
  _: Record<never, never>,
  ref: React.Ref<ComponentRef<typeof motion.div>>
) {
  const { messages, playTTS } = useVoice();
  const [isPlaying, setIsPlaying] = useState<string | null>(null);

  const handleSpeak = (text: string, id: string) => {
    setIsPlaying(id);
    playTTS(text);

    // Stop indicator when finished
    const checkInterval = setInterval(() => {
      if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
        setIsPlaying(null);
        clearInterval(checkInterval);
      }
    }, 100);
  };

  return (
    <motion.div layoutScroll className="grow overflow-auto p-4 pt-24" ref={ref}>
      <motion.div className="max-w-2xl mx-auto w-full flex flex-col gap-4 pb-24">
        <AnimatePresence mode="popLayout">
          {messages.map((msg: any, index: number) => {
            if (
              msg.type === "user_message" ||
              msg.type === "assistant_message"
            ) {
              const id = msg.type + index;

              return (
                <motion.div
                  key={id}
                  className={cn(
                    "w-[80%]",
                    "bg-card",
                    "border border-border rounded-xl",
                    msg.type === "user_message" ? "ml-auto" : ""
                  )}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 0 }}
                >
                  {/* Header */}
                  <div className="flex items-center justify-between pt-4 px-3">
                    <div className="text-xs capitalize font-medium leading-none opacity-50 tracking-tight">
                      {msg.message.role}
                    </div>
                    <div className="text-xs font-medium leading-none opacity-50 tracking-tight">
                      {msg.receivedAt.toLocaleTimeString(undefined, {
                        hour: "numeric",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>

                  {/* Content with Speaker on the LEFT */}
                  <div className="pb-3 px-3 flex items-start gap-2">
                    {msg.type === "assistant_message" && (
                      <button
                        onClick={() => handleSpeak(msg.message.content, id)}
                        disabled={isPlaying === id}
                        className={cn(
                          "mt-1 text-gray-500 hover:text-black",
                          isPlaying === id && "text-blue-500"
                        )}
                      >
                        {/* Inline Speaker Icon */}
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-5 h-5"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M11 5L6 9H2v6h4l5 4V5zM19.07 4.93a9 9 0 010 14.14M15.54 8.46a5 5 0 010 7.07"
                          />
                        </svg>
                      </button>
                    )}

                    {/* Text */}
                    <span className="whitespace-pre-line">
                      {msg.message.content}
                    </span>
                  </div>
                </motion.div>
              );
            }
            return null;
          })}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
});

export default Messages;
