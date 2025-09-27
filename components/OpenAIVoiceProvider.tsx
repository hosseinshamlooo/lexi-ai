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
}: OpenAIVoiceProviderProps) => {
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

  const updateMicFft = useCallback(() => {
    if (analyserRef.current && !isMuted) {
      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      analyserRef.current.getByteFrequencyData(dataArray);

      // Convert to normalized values (0-1)
      const normalizedData = Array.from(dataArray).map((value) => value / 255);
      setMicFft(normalizedData);
    } else {
      setMicFft([]);
    }

    animationFrameRef.current = requestAnimationFrame(updateMicFft);
  }, [isMuted]);

  const connect = useCallback(
    async ({ apiKey, voice = "alloy" }: { apiKey: string; voice?: string }) => {
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

        // Set up audio analysis for FFT
        audioContextRef.current = new AudioContext();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 256;
        source.connect(analyserRef.current);

        // Start FFT updates
        updateMicFft();

        // Set up media recorder with better format support
        const options = { mimeType: "audio/webm;codecs=opus" };
        if (MediaRecorder.isTypeSupported("audio/mp4")) {
          options.mimeType = "audio/mp4";
        } else if (MediaRecorder.isTypeSupported("audio/wav")) {
          options.mimeType = "audio/wav";
        }
        mediaRecorderRef.current = new MediaRecorder(stream, options);

        let audioChunks: Blob[] = [];

        mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
          if (event.data.size > 0) {
            audioChunks.push(event.data);
          }
        };

        mediaRecorderRef.current.onstop = async () => {
          if (audioChunks.length === 0) return;

          // Determine the correct MIME type and file extension
          const mimeType = mediaRecorderRef.current?.mimeType || "audio/webm";
          const fileExtension = mimeType.includes("mp4")
            ? "mp4"
            : mimeType.includes("wav")
            ? "wav"
            : "webm";

          const audioBlob = new Blob(audioChunks, { type: mimeType });
          audioChunks = [];

          // Check if audio is long enough (at least 0.5 seconds)
          if (audioBlob.size < 1000) {
            console.log("Audio too short, skipping transcription");
            return;
          }

          try {
            console.log(
              `Sending audio for transcription: ${audioBlob.size} bytes, type: ${mimeType}`
            );

            // Convert audio to text using OpenAI Whisper
            const formData = new FormData();
            formData.append("file", audioBlob, `audio.${fileExtension}`);
            formData.append("model", "whisper-1");
            formData.append("language", "en"); // Optional: specify language

            const transcriptionResponse = await fetch(
              "https://api.openai.com/v1/audio/transcriptions",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                },
                body: formData,
              }
            );

            if (!transcriptionResponse.ok) {
              const errorText = await transcriptionResponse.text();
              console.error(
                "Transcription failed:",
                transcriptionResponse.status,
                errorText
              );
              throw new Error(
                `Failed to transcribe audio: ${transcriptionResponse.status} ${errorText}`
              );
            }

            const transcription = await transcriptionResponse.json();
            const userMessage = transcription.text;

            // Add user message
            const userMsg: Message = {
              type: "user_message",
              message: {
                role: "user",
                content: userMessage,
              },
              receivedAt: new Date(),
            };

            setMessages((prev: Message[]) => [...prev, userMsg]);
            onMessage?.();

            // Get AI response
            const completion = await openaiRef.current!.chat.completions.create(
              {
                model: "gpt-4",
                messages: [
                  ...messages.map((msg: Message) => ({
                    role: msg.message.role,
                    content: msg.message.content,
                  })),
                  { role: "user", content: userMessage },
                ],
                max_tokens: 150,
              }
            );

            const assistantResponse =
              completion.choices[0]?.message?.content ||
              "Sorry, I could not generate a response.";

            // Add assistant message
            const assistantMsg: Message = {
              type: "assistant_message",
              message: {
                role: "assistant",
                content: assistantResponse,
              },
              receivedAt: new Date(),
            };

            setMessages((prev: Message[]) => [...prev, assistantMsg]);
            onMessage?.();

            // Convert text to speech using OpenAI TTS
            const ttsResponse = await fetch(
              "https://api.openai.com/v1/audio/speech",
              {
                method: "POST",
                headers: {
                  Authorization: `Bearer ${apiKey}`,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  model: "tts-1",
                  input: assistantResponse,
                  voice: voice,
                }),
              }
            );

            if (ttsResponse.ok) {
              const audioBuffer = await ttsResponse.arrayBuffer();
              const audioContext = new AudioContext();
              const audioBufferSource = audioContext.createBufferSource();
              const decodedAudio = await audioContext.decodeAudioData(
                audioBuffer
              );
              audioBufferSource.buffer = decodedAudio;
              audioBufferSource.connect(audioContext.destination);
              audioBufferSource.start();
            }
          } catch (error) {
            console.error("Error processing audio:", error);
            onError?.(error as Error);
          }
        };

        setStatus({ value: "connected" });
      } catch (error) {
        console.error("Error connecting:", error);
        setStatus({ value: "disconnected" });
        onError?.(error as Error);
      }
    },
    [messages, onMessage, onError, updateMicFft]
  );

  const disconnect = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      mediaRecorderRef.current.stop();
    }

    if (streamRef.current) {
      streamRef.current
        .getTracks()
        .forEach((track: MediaStreamTrack) => track.stop());
      streamRef.current = null;
    }

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }

    setStatus({ value: "disconnected" });
    setMicFft([]);
  }, []);

  const mute = useCallback(() => {
    setIsMuted(true);
  }, []);

  const unmute = useCallback(() => {
    setIsMuted(false);
  }, []);

  // Start/stop recording based on mute state
  useEffect(() => {
    if (status.value === "connected" && mediaRecorderRef.current) {
      if (!isMuted && mediaRecorderRef.current.state === "inactive") {
        mediaRecorderRef.current.start(3000); // Record in 3-second chunks for better quality
      } else if (isMuted && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    }
  }, [isMuted, status.value]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

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
