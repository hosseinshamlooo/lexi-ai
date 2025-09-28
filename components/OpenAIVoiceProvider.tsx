"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useCallback,
  useEffect,
} from "react";
import OpenAI from "openai";

interface Message {
  type: "user_message" | "assistant_message";
  message: {
    role: "user" | "assistant";
    content: string;
  };
  receivedAt: Date;
}

interface VoiceContextType {
  messages: Message[];
  status: { value: "idle" | "connecting" | "connected" | "disconnected" };
  isMuted: boolean;
  micFft: number[];
  connect: (config: { apiKey: string; voice?: string }) => Promise<void>;
  disconnect: () => void;
  mute: () => void;
  unmute: () => void;
}

const VoiceContext = createContext<VoiceContextType | null>(null);

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (!context) {
    throw new Error("useVoice must be used within OpenAIVoiceProvider");
  }
  return context;
};

interface OpenAIVoiceProviderProps {
  children: React.ReactNode;
  onMessage?: () => void;
  onError?: (error: Error) => void;
}

export const OpenAIVoiceProvider: React.FC<OpenAIVoiceProviderProps> = ({
  children,
  onMessage,
  onError,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<{
    value: "idle" | "connecting" | "connected" | "disconnected";
  }>({ value: "idle" });
  const [isMuted, setIsMuted] = useState(false);
  const [micFft, setMicFft] = useState<number[]>([]);

  const openaiRef = useRef<OpenAI | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // --- Mic FFT visualization ---
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

  // --- TTS using browser voices (French accent) ---
  const playTTS = useCallback((text: string) => {
    const speak = () => {
      const voices = window.speechSynthesis.getVoices();
      const frenchVoice =
        voices.find((v) => v.lang.startsWith("fr")) || voices[0];
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = frenchVoice;
      utterance.rate = 1;
      utterance.pitch = 1;
      window.speechSynthesis.speak(utterance);
    };

    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener("voiceschanged", speak, {
        once: true,
      });
    } else {
      speak();
    }
  }, []);

  const connect = useCallback(
    async ({ apiKey, voice }: { apiKey: string; voice?: string }) => {
      try {
        setStatus({ value: "connecting" });

        // Initialize OpenAI client
        openaiRef.current = new OpenAI({
          apiKey,
          dangerouslyAllowBrowser: true,
        });

        // Get microphone access
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        streamRef.current = stream;

        // Setup audio analysis
        audioContextRef.current = new AudioContext();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        source.connect(analyserRef.current);
        updateMicFft();

        // --- First greeting ---
        const greetingText =
          "Bonjour! Je suis votre assistant. Cliquez sur le micro pour parler.";
        setMessages((prev) => [
          ...prev,
          {
            type: "assistant_message",
            message: { role: "assistant", content: greetingText },
            receivedAt: new Date(),
          },
        ]);
        onMessage?.();
        playTTS(greetingText);

        // Setup MediaRecorder
        mediaRecorderRef.current = new MediaRecorder(stream, {
          mimeType: "audio/webm;codecs=opus",
        });
        let audioChunks: Blob[] = [];

        mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
          if (event.data.size > 0) audioChunks.push(event.data);
        };

        mediaRecorderRef.current.onstop = async () => {
          if (!audioChunks.length) return;
          const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
          audioChunks = [];

          if (audioBlob.size < 1000) return; // skip too short recordings

          try {
            const formData = new FormData();
            formData.append("file", audioBlob, "audio.webm");
            formData.append("model", "whisper-1");
            formData.append("language", "fr");

            const tr = await fetch(
              "https://api.openai.com/v1/audio/transcriptions",
              {
                method: "POST",
                headers: { Authorization: `Bearer ${apiKey}` },
                body: formData,
              }
            );

            const data = await tr.json();
            if (!data.text) return;

            const userMsg: Message = {
              type: "user_message",
              message: { role: "user", content: data.text },
              receivedAt: new Date(),
            };
            setMessages((prev) => [...prev, userMsg]);
            onMessage?.();

            const completion = await openaiRef.current!.chat.completions.create(
              {
                model: "gpt-4o-mini",
                messages: [
                  ...messages.map((msg) => ({
                    role: msg.message.role,
                    content: msg.message.content,
                  })),
                  { role: "user", content: data.text },
                ],
                max_tokens: 150,
              }
            );

            const assistantResponse =
              completion.choices[0]?.message?.content ||
              "Désolé, je n'ai pas pu générer de réponse.";

            const assistantMsg: Message = {
              type: "assistant_message",
              message: { role: "assistant", content: assistantResponse },
              receivedAt: new Date(),
            };
            setMessages((prev) => [...prev, assistantMsg]);
            onMessage?.();

            // Speak the assistant response in French
            playTTS(assistantResponse);
          } catch (err) {
            console.error("Error processing audio:", err);
            onError?.(err as Error);
          }
        };

        setStatus({ value: "connected" });
      } catch (err) {
        console.error("Error connecting:", err);
        setStatus({ value: "disconnected" });
        onError?.(err as Error);
      }
    },
    [messages, onMessage, onError, playTTS, updateMicFft]
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
    animationFrameRef.current = null;

    setStatus({ value: "disconnected" });
    setMicFft([]);
  }, []);

  const mute = useCallback(() => setIsMuted(true), []);
  const unmute = useCallback(() => setIsMuted(false), []);

  // Auto-start/stop recording based on mute
  useEffect(() => {
    if (status.value === "connected" && mediaRecorderRef.current) {
      if (!isMuted && mediaRecorderRef.current.state === "inactive")
        mediaRecorderRef.current.start(3000);
      else if (isMuted && mediaRecorderRef.current.state === "recording")
        mediaRecorderRef.current.stop();
    }
  }, [isMuted, status.value]);

  // Cleanup on unmount
  useEffect(() => () => disconnect(), [disconnect]);

  const value: VoiceContextType = {
    messages,
    status,
    isMuted,
    micFft,
    connect,
    disconnect,
    mute,
    unmute,
  };

  return (
    <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>
  );
};
