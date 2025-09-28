"use client";

import { AnimatePresence, motion } from "motion/react";
import { Button } from "./ui/button";
import { Phone } from "lucide-react";
import { toast } from "sonner";
import { useVoice } from "./OpenAIVoiceProvider";

export default function StartCall({
  apiKey,
  voice,
  inline = false,
  onConnect,
  onClick,
}: {
  apiKey: string;
  voice?: string;
  inline?: boolean;
  onConnect?: () => void;
  onClick?: () => void;
}) {
  const voiceContext = useVoice();
  if (!voiceContext) return null;

  const { status, connect } = voiceContext;

  if (status.value === "connected") return null;

  const containerClasses = inline
    ? "flex items-center justify-center"
    : "fixed inset-0 p-4 flex items-center justify-center bg-background";

  const handleClick = async () => {
    onClick?.(); // set callClicked
    try {
      await connect({ apiKey, voice: voice || "onyx" });
      onConnect?.(); // scroll after connection succeeds
    } catch (err) {
      console.error(err);
      toast.error("Unable to start call");
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
            className="z-50 flex items-center gap-1.5 rounded-full"
            onClick={handleClick}
          >
            <Phone className="size-4 opacity-50 fill-current" strokeWidth={0} />
            <span>Start Call</span>
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
