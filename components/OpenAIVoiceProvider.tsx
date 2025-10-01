"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";

export interface ChatMessage {
  type: "user_message" | "assistant_message";
  message: { role: "user" | "assistant"; content: string };
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
  sendPromptToLLM: (prompt: string) => Promise<void>; // <-- Add this
}

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

  // === MIC FFT ===
  const updateMicFft = useCallback(() => {
    if (analyserRef.current && !isMuted) {
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);
      setMicFft(Array.from(dataArray).map((v) => v / 255));
    } else setMicFft([]);
    animationFrameRef.current = requestAnimationFrame(updateMicFft);
  }, [isMuted]);

  // === TTS ===
  const playTTS = useCallback(
    (text: string) => {
      const speak = () => {
        const voices = window.speechSynthesis.getVoices();
        const selectedVoice =
          voices.find((v) => v.lang.toLowerCase().startsWith(language)) ||
          voices[0];
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = selectedVoice;
        window.speechSynthesis.speak(utterance);
      };
      if (!window.speechSynthesis.getVoices().length) {
        window.speechSynthesis.addEventListener("voiceschanged", speak, {
          once: true,
        });
      } else speak();
    },
    [language]
  );

  const stopTTS = useCallback(() => {
    if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // === SEND ASSISTANT MESSAGE ===
  const sendAssistantMessage = useCallback(
    (text: string) => {
      const msg: ChatMessage = {
        type: "assistant_message",
        message: { role: "assistant", content: text },
        receivedAt: new Date(),
      };
      setMessages((prev) => [...prev, msg]);
      playTTS(text);
    },
    [playTTS]
  );

  // === SEND USER MESSAGE (normal user input) ===
  const sendMessage = useCallback(
    async (content: string, prompt?: string) => {
      const userMsg: ChatMessage = {
        type: "user_message",
        message: { role: "user", content },
        receivedAt: new Date(),
      };
      setMessages((prev) => [...prev, userMsg]);

      try {
        const res = await fetch("/api/voice/sendMessage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: content, prompt, language }),
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

  // === SEND PROMPT SILENTLY (no user message) ===
  const sendPromptToLLM = useCallback(
    async (prompt: string) => {
      try {
        const res = await fetch("/api/voice/sendMessage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: "", prompt, language }),
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

  // === CONNECT ===
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

        // Send greeting only
        if (greeting) sendAssistantMessage(greeting);

        // Send initial prompt silently
        if (prompt) await sendPromptToLLM(prompt);

        // MEDIA RECORDER
        const supportedMime = [
          "audio/webm;codecs=opus",
          "audio/ogg;codecs=opus",
          "audio/wav",
        ].find(MediaRecorder.isTypeSupported);
        if (!supportedMime)
          throw new Error("No supported MediaRecorder MIME type");

        mediaRecorderRef.current = new MediaRecorder(stream, {
          mimeType: supportedMime,
        });
        mediaRecorderRef.current.ondataavailable = async (e) => {
          if (!e.data || e.data.size < 2000) return;

          const extension = supportedMime.includes("wav")
            ? "wav"
            : supportedMime.includes("ogg")
            ? "ogg"
            : "webm";
          const audioBlob = new Blob([e.data], { type: supportedMime });

          try {
            const formData = new FormData();
            formData.append("file", audioBlob, `chunk.${extension}`);
            formData.append("voice", voice || "");
            formData.append("language", language);

            const serverRes = await fetch("/api/voice/process", {
              method: "POST",
              body: formData,
            });
            if (!serverRes.ok) throw new Error("Failed to process audio");

            const result = await serverRes.json();

            if (result.text) {
              // Add user message for actual microphone input
              const userMsg: ChatMessage = {
                type: "user_message",
                message: { role: "user", content: result.text },
                receivedAt: new Date(),
              };
              setMessages((prev) => [...prev, userMsg]);
              onMessage?.();
            }

            if (result.response) sendAssistantMessage(result.response);
          } catch (err) {
            console.error(err);
            onError?.(err as Error);
          }
        };

        setStatus({ value: "connected" });
      } catch (err) {
        console.error(err);
        setStatus({ value: "disconnected" });
        onError?.(err as Error);
      }
    },
    [
      language,
      onError,
      onMessage,
      updateMicFft,
      sendAssistantMessage,
      sendPromptToLLM,
    ]
  );

  // === DISCONNECT / RESET / MUTE / UNMUTE ===
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

  const mute = useCallback(() => {
    setIsMuted(true);
    if (mediaRecorderRef.current?.state === "recording")
      mediaRecorderRef.current.stop();
  }, []);

  const unmute = useCallback(() => {
    setIsMuted(false);
    if (
      status.value === "connected" &&
      mediaRecorderRef.current?.state === "inactive"
    ) {
      mediaRecorderRef.current.start();
    }
  }, [status.value]);

  useEffect(() => () => disconnect(), [disconnect]);

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
      }}
    >
      {children}
    </VoiceContext.Provider>
  );
};
