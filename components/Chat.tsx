"use client";

import { useEffect, useRef } from "react";
import Messages from "./Messages";
import Controls from "./Controls";
import { useVoice } from "./OpenAIVoiceProvider";

interface ChatProps {
  greeting?: string; // The greeting from Hero's selected situation
  prompt?: string; // The situation-specific prompt for the AI
}

export default function Chat({ greeting, prompt }: ChatProps) {
  const { sendMessage, sendAssistantMessage } = useVoice(); // <-- extract both
  const containerRef = useRef<HTMLDivElement | null>(null);

  // === Send the assistant greeting once on mount ===
  useEffect(() => {
    if (greeting && sendAssistantMessage) {
      sendAssistantMessage(greeting, prompt);
    }
  }, [greeting, prompt, sendAssistantMessage]);

  // === Auto-scroll on new messages ===
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new MutationObserver(() => {
      container.scrollTop = container.scrollHeight;
    });

    observer.observe(container, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      id="chat-container"
      ref={containerRef}
      className="relative grow flex flex-col mx-auto w-full overflow-hidden"
    >
      <Messages />
      <Controls />
    </div>
  );
}
