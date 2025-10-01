"use client";

import { useEffect, useRef } from "react";
import Messages from "./Messages";
import Controls from "./Controls";
import { useVoice } from "./OpenAIVoiceProvider";

interface ChatProps {
  greeting?: string; // The assistant greeting from the Hero section
  prompt?: string; // Optional system prompt or situation-specific context
}

export default function Chat({ greeting, prompt }: ChatProps) {
  const { sendAssistantMessage } = useVoice(); // Only call the assistant message
  const containerRef = useRef<HTMLDivElement | null>(null);
  const hasSentGreeting = useRef(false); // Track if greeting has been sent

  // === Send the assistant greeting ONCE when component mounts or greeting changes ===
  useEffect(() => {
    if (greeting && !hasSentGreeting.current) {
      sendAssistantMessage(greeting, prompt);
      hasSentGreeting.current = true; // Prevent duplicate greetings
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
