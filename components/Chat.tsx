"use client";

import { OpenAIVoiceProvider } from "./OpenAIVoiceProvider";
import Messages from "./Messages";
import Controls from "./Controls";
import StartCall from "./StartCall";
import { ComponentRef, useRef } from "react";
import { toast } from "sonner";

export default function ClientComponent({ apiKey }: { apiKey: string }) {
  const timeout = useRef<number | null>(null);
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);

  // optional: use voice from environment variable
  const voice = process.env["NEXT_PUBLIC_OPENAI_VOICE"] || "alloy";

  return (
    <div
      className={
        "relative grow flex flex-col mx-auto w-full overflow-hidden h-[0px]"
      }
    >
      <OpenAIVoiceProvider
        onMessage={() => {
          if (timeout.current) {
            window.clearTimeout(timeout.current);
          }

          timeout.current = window.setTimeout(() => {
            if (ref.current) {
              const scrollHeight = ref.current.scrollHeight;

              ref.current.scrollTo({
                top: scrollHeight,
                behavior: "smooth",
              });
            }
          }, 200);
        }}
        onError={(error: Error) => {
          toast.error(error.message);
        }}
      >
        <Messages ref={ref} />
        <Controls />
        <StartCall voice={voice} apiKey={apiKey} />
      </OpenAIVoiceProvider>
    </div>
  );
}
