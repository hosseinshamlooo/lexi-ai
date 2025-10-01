"use client";

import { useEffect, useRef } from "react";
import Messages from "./Messages";
import Controls from "./Controls";
import { useVoice } from "./OpenAIVoiceProvider";

interface ChatProps {
  greeting?: string; // Assistant greeting
  prompt?: string; // Optional system prompt to feed LLM
}

export default function Chat({ greeting, prompt }: ChatProps) {
  const { sendAssistantMessage, sendPromptToLLM } = useVoice(); // Use the silent prompt method
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasSentGreeting = useRef(false);

  useEffect(() => {
    if (greeting && !hasSentGreeting.current) {
      sendAssistantMessage(greeting); // Only show assistant greeting
      if (prompt) sendPromptToLLM(prompt); // Feed LLM silently, no user message
      hasSentGreeting.current = true;
    }
  }, [greeting, prompt, sendAssistantMessage, sendPromptToLLM]);

  // Auto-scroll
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
