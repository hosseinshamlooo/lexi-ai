"use client";

import { useVoice } from "./OpenAIVoiceProvider";
import { Button } from "./ui/button";
import { Mic, MicOff, Phone } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { Toggle } from "./ui/toggle";
import MicFFT from "./MicFFT";
import { cn } from "@/utils";

interface ControlsProps {
  onEndCall?: () => void;
}

export default function Controls({ onEndCall }: ControlsProps) {
  const { reset, status, isMuted, unmute, mute, micFft } = useVoice();

  const handleEndCall = () => {
    reset(); // reset mic/messages
    onEndCall?.(); // tell page to show Hero again
  };

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 w-full p-4 pb-6 flex items-center justify-center",
        "bg-gradient-to-t from-card via-card/90 to-card/0"
      )}
    >
      <AnimatePresence>
        {status.value === "connected" && (
          <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            className="p-4 bg-card border border-border/50 rounded-full flex items-center gap-4"
          >
            {/* Mic toggle */}
            <Toggle
              className="rounded-full"
              pressed={!isMuted}
              onPressedChange={() => {
                if (isMuted) unmute();
                else mute();
              }}
            >
              {isMuted ? (
                <MicOff className="size-4" />
              ) : (
                <Mic className="size-4" />
              )}
            </Toggle>

            {/* Mic FFT */}
            <div className="relative grid h-8 w-48 shrink grow-0">
              <MicFFT fft={micFft} className="fill-current" />
            </div>

            {/* End Call */}
            <Button
              className="flex items-center gap-1 rounded-full"
              onClick={handleEndCall}
              variant="destructive"
            >
              <Phone
                className="size-4 opacity-50 fill-current"
                strokeWidth={0}
              />
              <span>End Call</span>
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
