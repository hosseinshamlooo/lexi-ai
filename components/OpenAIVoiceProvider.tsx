"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";

// ========================
// Types
// ========================

export interface ChatMessage {
  type: "user_message" | "assistant_message";
  message: {
    role: "user" | "assistant";
    content: string;
    translations: Record<string, string>; // always defined
  };
  receivedAt: Date;
}

interface VoiceContextType {
  messages: ChatMessage[];
  status: { value: "idle" | "connecting" | "connected" | "disconnected" };
  isMuted: boolean;
  micFft: number[];
  connect: (config?: {
    voice?: string;
    greeting?: string;
    prompt?: string;
  }) => Promise<void>;
  disconnect: () => void;
  mute: () => void;
  unmute: () => void;
  reset: () => void;
  sendMessage: (content: string, prompt?: string) => Promise<void>;
  sendAssistantMessage: (content: string) => void;
  sendPromptToLLM: (prompt: string) => Promise<void>;
  playTTS: (text: string) => void;
}

// ========================
// Context
// ========================

const VoiceContext = createContext<VoiceContextType | null>(null);

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context)
    throw new Error("useVoice must be used within OpenAIVoiceProvider");
  return context;
};

interface OpenAIVoiceProviderProps {
  children: React.ReactNode;
  language: string;
  onMessage?: () => void;
  onError?: (err: Error) => void;
}

// ========================
// Provider
// ========================

export const OpenAIVoiceProvider: React.FC<OpenAIVoiceProviderProps> = ({
  children,
  language,
  onMessage,
  onError,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [status, setStatus] = useState<VoiceContextType["status"]>({
    value: "idle",
  });
  const [isMuted, setIsMuted] = useState(true);
  const [micFft, setMicFft] = useState<number[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const activePromptRef = useRef<string>("");

  // ========================
  // Helpers
  // ========================

  const ensureTranslations = (text: string): Record<string, string> => {
    // ⚡ Replace this with a real translation API later
    const words = text.split(/\s+/);
    const translations: Record<string, string> = {};
    words.forEach((w) => {
      const clean = w.replace(/[.,?!;]/g, "");
      if (clean) translations[clean] = `EN:${clean}`;
    });
    return translations;
  };

  // Mic FFT
  const updateMicFft = useCallback(() => {
    if (analyserRef.current && !isMuted) {
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);
      setMicFft(Array.from(dataArray).map((v) => v / 255));
    } else {
      setMicFft([]);
    }
    animationFrameRef.current = requestAnimationFrame(updateMicFft);
  }, [isMuted]);

  // TTS
  const playTTS = useCallback(
    (text: string) => {
      const speak = () => {
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice =
          voices.find((v) =>
            v.lang.toLowerCase().startsWith(language.toLowerCase())
          ) || voices[0];
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = selectedVoice;
        window.speechSynthesis.speak(utterance);
      };
      if (!window.speechSynthesis.getVoices().length) {
        window.speechSynthesis.addEventListener("voiceschanged", speak, {
          once: true,
        });
      } else {
        speak();
      }
    },
    [language]
  );

  const stopTTS = useCallback(() => {
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // ========================
  // Message handling
  // ========================

  const sendAssistantMessage = useCallback(
    (text: string) => {
      const msg: ChatMessage = {
        type: "assistant_message",
        message: {
          role: "assistant",
          content: text,
          translations: ensureTranslations(text),
        },
        receivedAt: new Date(),
      };
      setMessages((prev) => [...prev, msg]);
      playTTS(text);
    },
    [ensureTranslations, playTTS]
  );

  const sendMessage = useCallback(
    async (content: string, prompt?: string) => {
      const userMsg: ChatMessage = {
        type: "user_message",
        message: {
          role: "user",
          content,
          translations: {}, // no translations for user messages
        },
        receivedAt: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);

      try {
        const res = await fetch("/api/voice/sendMessage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: content,
            prompt: prompt || activePromptRef.current,
            language,
          }),
        });
        const data = await res.json();
        if (data.response) sendAssistantMessage(data.response);
      } catch (err) {
        console.error(err);
        onError?.(err as Error);
      }
    },
    [language, onError, sendAssistantMessage]
  );

  const sendPromptToLLM = useCallback(
    async (prompt: string) => {
      activePromptRef.current = prompt;
      try {
        await fetch("/api/voice/sendMessage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "", prompt, language }),
        });
      } catch (err) {
        console.error(err);
        onError?.(err as Error);
      }
    },
    [language, onError]
  );

  // ========================
  // Connection handling
  // ========================

  const connect = useCallback(
    async ({
      voice,
      greeting,
      prompt,
    }: { voice?: string; greeting?: string; prompt?: string } = {}) => {
      try {
        setStatus({ value: "connecting" });

        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        streamRef.current = stream;

        audioContextRef.current = new AudioContext();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        source.connect(analyserRef.current);
        updateMicFft();

        if (greeting) sendAssistantMessage(greeting);
        if (prompt) await sendPromptToLLM(prompt);

        setStatus({ value: "connected" });
      } catch (err) {
        console.error(err);
        setStatus({ value: "disconnected" });
        onError?.(err as Error);
      }
    },
    [onError, sendAssistantMessage, sendPromptToLLM, updateMicFft]
  );

  const disconnect = useCallback(() => {
    if (mediaRecorderRef.current?.state === "recording")
      mediaRecorderRef.current.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    streamRef.current = null;

    audioContextRef.current?.close();
    audioContextRef.current = null;

    if (animationFrameRef.current)
      cancelAnimationFrame(animationFrameRef.current);

    stopTTS();
    setStatus({ value: "disconnected" });
    setMicFft([]);
  }, [stopTTS]);

  const reset = useCallback(() => {
    disconnect();
    setIsMuted(true);
    setMessages([]);
    setMicFft([]);
    setStatus({ value: "idle" });
  }, [disconnect]);

  const mute = useCallback(() => setIsMuted(true), []);
  const unmute = useCallback(() => setIsMuted(false), []);

  useEffect(() => () => disconnect(), [disconnect]);

  // ========================
  // Return
  // ========================

  return (
    <VoiceContext.Provider
      value={{
        messages,
        status,
        isMuted,
        micFft,
        connect,
        disconnect,
        mute,
        unmute,
        reset,
        sendMessage,
        sendAssistantMessage,
        sendPromptToLLM,
        playTTS,
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};
