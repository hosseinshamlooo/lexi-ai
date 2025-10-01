"use client";

import { useEffect, useRef } from "react";
import Messages from "./Messages";
import Controls from "./Controls";
import { useVoice } from "./OpenAIVoiceProvider";

interface ChatProps {
  greeting?: string;
  prompt?: string;
}

export default function Chat({ greeting, prompt }: ChatProps) {
  const { sendAssistantMessage, sendPromptToLLM } = useVoice();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasSentGreeting = useRef(false);

  useEffect(() => {
    if (greeting && !hasSentGreeting.current) {
      sendAssistantMessage(greeting); // show greeting
      if (prompt) sendPromptToLLM(prompt); // feed prompt silently
      hasSentGreeting.current = true;
    }
  }, [greeting, prompt, sendAssistantMessage, sendPromptToLLM]);

  // auto scroll
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
