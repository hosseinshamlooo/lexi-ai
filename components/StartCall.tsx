"use client";

import { AnimatePresence, motion } from "motion/react";
import { Button } from "./ui/button";
import { Phone } from "lucide-react";
import { useVoice } from "./OpenAIVoiceProvider";

export default function StartCall({
  voice,
  inline = false,
  onClick,
}: {
  voice?: string;
  inline?: boolean;
  onClick?: () => void; // Called when call successfully starts
}) {
  const voiceContext = useVoice();
  if (!voiceContext) return null;

  const { status, connect } = voiceContext;
  if (status.value === "connected") return null;

  const containerClasses = inline
    ? "flex items-center justify-center"
    : "fixed inset-0 p-4 flex items-center justify-center bg-background";

  const handleClick = async () => {
    try {
      // Call server to get any required data (e.g., greeting)
      const res = await fetch("/api/voice/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ voice }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData?.error || "Failed to start call");
      }

      const data = await res.json();

      // Connect voice context
      await connect({ voice, ...data });

      // Notify parent that call has started
      onClick?.();
    } catch (err: any) {
      console.error(err);
      alert(`Unable to start call: ${err.message}`);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className={containerClasses}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.5 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.5 }}
        >
          <Button
            className="z-50 flex items-center gap-1.5 rounded-full px-7 py-5 text-base"
            onClick={handleClick}
            disabled={status.value === "connecting"}
          >
            <Phone className="size-5 opacity-50 fill-current" strokeWidth={0} />
            <span>
              {status.value === "connecting" ? "Connecting..." : "Start Call"}
            </span>
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
