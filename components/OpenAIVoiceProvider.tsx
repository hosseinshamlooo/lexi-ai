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
  type: "user_message" | "assistant_message" | "typing_indicator";
  message: {
    role: "user" | "assistant";
    content: string;
  };
  receivedAt: Date;
  isTyping?: boolean;
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
  const audioChunksRef = useRef<Blob[]>([]);

  // ========================
  // Helpers
  // ========================

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
      if (!text) {
        console.log("TTS: No text provided");
        return;
      }

      console.log("TTS: Attempting to speak:", text);

      const speak = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log(
          `TTS: Available voices (${voices.length}):`,
          voices.map((v) => `${v.name} (${v.lang})`)
        );
        console.log(`TTS: Looking for language: ${language}`);

        // Prefer Google voices over others
        const matchingVoices = voices.filter((v) =>
          v.lang.toLowerCase().startsWith(language.toLowerCase())
        );

        const googleVoice = matchingVoices.find((v) =>
          v.name.includes("Google")
        );
        const selectedVoice = googleVoice || matchingVoices[0] || voices[0];

        console.log(
          `TTS: Selected voice:`,
          selectedVoice?.name,
          `(${selectedVoice?.lang})`
        );

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = selectedVoice;
        utterance.lang = selectedVoice?.lang || language;
        utterance.rate = 1.0;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;

        utterance.onstart = () => {
          console.log("✅ TTS started:", text.substring(0, 50));
          console.log("TTS: Volume level:", utterance.volume);
        };
        utterance.onend = () => {
          console.log("✅ TTS ended successfully");
        };
        utterance.onpause = () => {
          console.log("⏸️ TTS paused");
        };
        utterance.onresume = () => {
          console.log("▶️ TTS resumed");
        };
        utterance.onboundary = (e) => {
          console.log("🔊 TTS boundary:", e.name, "at char", e.charIndex);
        };
        utterance.onerror = (e) => {
          console.error("❌ TTS error:", e);
          console.error("Error details:", {
            error: e.error,
            charIndex: e.charIndex,
            elapsedTime: e.elapsedTime,
          });
        };

        console.log("TTS: Calling speechSynthesis.speak()");
        console.log(
          "TTS: Current paused status:",
          window.speechSynthesis.paused
        );

        // Resume if paused (Chrome bug workaround)
        if (window.speechSynthesis.paused) {
          console.log("TTS: Resuming paused speech synthesis");
          window.speechSynthesis.resume();
        }

        window.speechSynthesis.speak(utterance);

        // Chrome bug workaround: resume after a short delay
        setTimeout(() => {
          if (window.speechSynthesis.paused) {
            console.log("TTS: Resuming after speak (Chrome workaround)");
            window.speechSynthesis.resume();
          }
        }, 50);

        // Check if it's actually speaking
        setTimeout(() => {
          console.log("TTS: Speaking status:", window.speechSynthesis.speaking);
          console.log("TTS: Pending status:", window.speechSynthesis.pending);
          console.log("TTS: Paused status:", window.speechSynthesis.paused);
        }, 100);

        // Check again after 1 second
        setTimeout(() => {
          console.log(
            "TTS [1s later]: Speaking:",
            window.speechSynthesis.speaking
          );
          console.log(
            "TTS [1s later]: Pending:",
            window.speechSynthesis.pending
          );
        }, 1000);
      };

      const voices = window.speechSynthesis.getVoices();
      if (!voices.length) {
        console.log("TTS: Waiting for voices to load...");
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
      console.log("🛑 stopTTS: Cancelling speech synthesis");
      console.trace("stopTTS called from:");
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
        },
        receivedAt: new Date(),
      };

      // Replace assistant typing indicator if it exists, otherwise add new message
      setMessages((prev) => {
        console.log(
          "🔍 sendAssistantMessage - before adding assistant message:",
          prev
        );
        const lastMessage = prev[prev.length - 1];
        if (
          lastMessage &&
          lastMessage.type === "typing_indicator" &&
          lastMessage.message.role === "assistant" &&
          lastMessage.isTyping
        ) {
          // Replace the assistant typing indicator with the actual message
          const updatedMessages = [...prev.slice(0, -1), msg];
          console.log(
            "🔍 sendAssistantMessage - after replacing typing indicator:",
            updatedMessages
          );
          return updatedMessages;
        }
        const updatedMessages = [...prev, msg];
        console.log(
          "🔍 sendAssistantMessage - after adding new message:",
          updatedMessages
        );
        return updatedMessages;
      });

      playTTS(text);
    },
    [playTTS]
  );

  const sendMessage = useCallback(async (content: string, prompt?: string) => {
    const userMsg: ChatMessage = {
      type: "user_message",
      message: {
        role: "user",
        content,
      },
      receivedAt: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);

    // Note: sendMessage functionality can be implemented here if needed
    // For now, it just adds the user message to the chat
  }, []);

  const sendPromptToLLM = useCallback(async (prompt: string) => {
    activePromptRef.current = prompt;
    // Note: sendPromptToLLM functionality can be implemented here if needed
    // For now, it just stores the prompt in the ref
  }, []);

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

  const mute = useCallback(() => {
    setIsMuted(true);

    // Stop recording when muted
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      console.log("🎙️ Stopping recording...");

      mediaRecorderRef.current.stop();
    }
  }, []);

  const unmute = useCallback(() => {
    setIsMuted(false);

    // Start recording when unmuted
    if (streamRef.current && status.value === "connected") {
      console.log("🎙️ Starting recording...");

      // Add user typing indicator immediately when they start talking
      const userTypingMsg: ChatMessage = {
        type: "typing_indicator",
        message: {
          role: "user",
          content: "You're speaking...",
        },
        receivedAt: new Date(),
        isTyping: true,
      };
      setMessages((prev) => [...prev, userTypingMsg]);

      audioChunksRef.current = [];

      const mediaRecorder = new MediaRecorder(streamRef.current, {
        mimeType: "audio/webm",
      });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        console.log("🎙️ Recording stopped, processing audio...");
        console.log("🔍 Audio chunks recorded:", audioChunksRef.current.length);
        console.log(
          "🔍 Total audio size:",
          audioChunksRef.current.reduce(
            (total, chunk) => total + chunk.size,
            0
          ),
          "bytes"
        );

        const audioBlob = new Blob(audioChunksRef.current, {
          type: "audio/webm",
        });

        console.log("🔍 Audio blob size:", audioBlob.size, "bytes");

        // Send to API for transcription
        try {
          const formData = new FormData();
          formData.append("file", audioBlob, "recording.webm");
          formData.append("language", language);
          formData.append("prompt", activePromptRef.current);

          const response = await fetch("/api/voice/process", {
            method: "POST",
            body: formData,
          });

          let data;
          const contentType = response.headers.get("content-type");

          if (contentType && contentType.includes("application/json")) {
            data = await response.json();
          } else {
            // Server returned HTML (error page)
            const text = await response.text();
            console.error(
              "❌ Server returned non-JSON response:",
              text.substring(0, 500)
            );
            throw new Error(
              "Server error. Check console for details and ensure OPENAI_API_KEY is configured in .env.local"
            );
          }

          if (!response.ok) {
            throw new Error(data.error || "Failed to process audio");
          }
          console.log("📝 Transcription:", data.text);
          console.log("🤖 AI Response:", data.response);
          console.log("🔍 Full API response data:", data);

          // Replace user typing indicator with actual transcribed text, then add assistant typing indicator
          if (data.text) {
            const userMsg: ChatMessage = {
              type: "user_message",
              message: {
                role: "user",
                content: data.text,
              },
              receivedAt: new Date(),
            };

            const assistantTypingMsg: ChatMessage = {
              type: "typing_indicator",
              message: {
                role: "assistant",
                content: "Lexi is thinking...",
              },
              receivedAt: new Date(),
              isTyping: true,
            };

            // Replace user typing indicator with actual message and add assistant typing indicator
            setMessages((prev) => {
              console.log(
                "🔍 Before adding user message, current messages:",
                prev
              );

              // Remove user typing indicator if it exists
              const lastMessage = prev[prev.length - 1];
              let newMessages = prev;
              if (
                lastMessage &&
                lastMessage.type === "typing_indicator" &&
                lastMessage.message.role === "user"
              ) {
                newMessages = prev.slice(0, -1);
              }

              // Add user message and assistant typing indicator
              const updatedMessages = [
                ...newMessages,
                userMsg,
                assistantTypingMsg,
              ];
              console.log(
                "🔍 After adding user message, new messages:",
                updatedMessages
              );
              console.log("🔍 User message being added:", userMsg);

              return updatedMessages;
            });
          } else {
            // No user transcription, remove user typing indicator
            setMessages((prev) => {
              const lastMessage = prev[prev.length - 1];
              if (
                lastMessage &&
                lastMessage.type === "typing_indicator" &&
                lastMessage.message.role === "user" &&
                lastMessage.isTyping
              ) {
                return prev.slice(0, -1);
              }
              return prev;
            });
          }

          // Add assistant response
          if (data.response) {
            sendAssistantMessage(data.response);
          } else {
            // Remove assistant typing indicator if no response
            setMessages((prev) => {
              const lastMessage = prev[prev.length - 1];
              if (
                lastMessage &&
                lastMessage.type === "typing_indicator" &&
                lastMessage.message.role === "assistant" &&
                lastMessage.isTyping
              ) {
                return prev.slice(0, -1);
              }
              return prev;
            });
          }
        } catch (error) {
          console.error("❌ Error processing audio:", error);

          // Remove user typing indicator on error (since processing failed)
          setMessages((prev) => {
            const lastMessage = prev[prev.length - 1];
            if (
              lastMessage &&
              lastMessage.type === "typing_indicator" &&
              lastMessage.message.role === "user" &&
              lastMessage.isTyping
            ) {
              return prev.slice(0, -1);
            }
            return prev;
          });

          onError?.(error as Error);
        }
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
    }
  }, [language, status, onError, sendAssistantMessage]);

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
