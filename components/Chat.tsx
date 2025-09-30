"use client";

import Messages from "./Messages";
import Controls from "./Controls";
import { ComponentRef, useRef } from "react";

export default function Chat() {
  const ref = useRef<ComponentRef<typeof Messages> | null>(null);

  return (
    <div
      id="chat-container"
      className="relative grow flex flex-col mx-auto w-full overflow-hidden"
    >
      {/* Use the provider from ClientPage, do NOT create a new one */}
      <Messages ref={ref} />
      <Controls />

      {/* Auto-scroll when new messages arrive */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            const ref = document.getElementById('chat-container');
            if(ref) {
              const observer = new MutationObserver(() => {
                ref.scrollTop = ref.scrollHeight;
              });
              observer.observe(ref, { childList: true, subtree: true });
            }
          `,
        }}
      />
    </div>
  );
}
