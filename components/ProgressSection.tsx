"use client";

import { ArrowLeft, ArrowRight, ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { ChatMessage } from "./OpenAIVoiceProvider";

interface ProgressSectionProps {
  feedbackData: {
    progress: {
      speakingTime: { student: number; teacher: number };
      totalWords: number;
      newWords: number;
    };
    feedback: Array<{
      type: string;
      text: string;
      highlight: string;
    }>;
  };
  userMessages?: ChatMessage[];
  language?: string;
  conversationAnalysis?: {
    summary: string;
    level: string;
    topics: Array<{
      title: string;
      points: string[];
    }>;
  } | null;
  onNavigateToRecap: () => void;
  onNavigateToFeedback: () => void;
}

export default function ProgressSection({
  feedbackData,
  userMessages = [],
  language = "en",
  conversationAnalysis,
  onNavigateToRecap,
  onNavigateToFeedback,
}: ProgressSectionProps) {
  // Extract user messages for dynamic data generation
  const userTranscriptions = useMemo(() => {
    const transcriptions = userMessages
      .filter((msg) => msg.type === "user_message")
      .map((msg) => msg.message.content)
      .join(" ");

    return transcriptions;
  }, [userMessages]);

  // Generate dynamic data based on user transcriptions
  const dynamicData = useMemo(() => {
    // Calculate total words from user messages
    const totalWords =
      userTranscriptions && userTranscriptions.trim() !== ""
        ? userTranscriptions.split(/\s+/).length
        : 0;

    // Calculate speaking time based on actual messages
    const userMsgs = userMessages.filter((msg) => msg.type === "user_message");
    const assistantMsgs = userMessages.filter(
      (msg) => msg.type === "assistant_message"
    );

    const wordsPerMinute = language === "fr" ? 120 : 150;

    const userWords = userMsgs.reduce((total, msg) => {
      return total + msg.message.content.split(/\s+/).length;
    }, 0);

    const assistantWords = assistantMsgs.reduce((total, msg) => {
      return total + msg.message.content.split(/\s+/).length;
    }, 0);

    // Calculate speaking time based on actual message timestamps if available
    // For now, use a more realistic estimation based on message count and average speaking time
    const userMessageCount = userMsgs.length;
    const assistantMessageCount = assistantMsgs.length;

    // Estimate speaking time: assume average 3-5 seconds per user message
    const estimatedSecondsPerUserMessage = 4; // 4 seconds average
    const estimatedSecondsPerAssistantMessage = 6; // 6 seconds average for longer responses

    const userSpeakingTime =
      Math.round(
        ((userMessageCount * estimatedSecondsPerUserMessage) / 60) * 10
      ) / 10;
    const assistantSpeakingTime =
      Math.round(
        ((assistantMessageCount * estimatedSecondsPerAssistantMessage) / 60) *
          10
      ) / 10;

    const totalSpeakingTime = userSpeakingTime + assistantSpeakingTime;

    // Calculate speaking speed (WPM) - words per minute of user speaking time only
    const speakingSpeed =
      userSpeakingTime > 0 ? Math.round(userWords / userSpeakingTime) : 0;

    // Extract unique words for vocabulary
    const words = userTranscriptions.toLowerCase().split(/\s+/);
    const commonWords =
      language === "fr"
        ? [
            "le",
            "la",
            "les",
            "un",
            "une",
            "des",
            "du",
            "de",
            "et",
            "ou",
            "mais",
            "dans",
            "sur",
            "avec",
            "par",
            "pour",
            "est",
            "sont",
            "était",
            "étaient",
            "être",
            "avoir",
            "a",
            "ont",
            "peut",
            "pourrait",
            "devrait",
            "voudrait",
            "va",
          ]
        : [
            "the",
            "and",
            "or",
            "but",
            "in",
            "on",
            "at",
            "to",
            "for",
            "of",
            "with",
            "by",
            "is",
            "are",
            "was",
            "were",
            "be",
            "been",
            "have",
            "has",
            "had",
            "do",
            "does",
            "did",
            "can",
            "could",
            "should",
            "would",
            "will",
            "may",
            "might",
            "must",
          ];

    const filteredWords = words.filter(
      (word) =>
        word.length > 3 && !commonWords.includes(word) && /^[a-zA-Z]/.test(word)
    );
    const uniqueWords = Array.from(new Set(filteredWords));

    // Use level from API analysis, fallback to A0 if not available
    const levelDisplay = conversationAnalysis?.level || "A0";
    const levelIndex =
      levelDisplay === "A0"
        ? 0
        : levelDisplay.startsWith("A1")
        ? 1
        : levelDisplay.startsWith("B1")
        ? 2
        : levelDisplay.startsWith("B2")
        ? 3
        : levelDisplay === "C1"
        ? 4
        : 0; // fallback to A0

    return {
      totalWords,
      newWords: uniqueWords.length,
      userSpeakingTime,
      assistantSpeakingTime,
      speakingSpeed,
      level: levelDisplay,
      levelIndex,
      userPercentage:
        totalSpeakingTime > 0
          ? Math.round((userSpeakingTime / totalSpeakingTime) * 100)
          : 0,
      assistantPercentage:
        totalSpeakingTime > 0
          ? Math.round((assistantSpeakingTime / totalSpeakingTime) * 100)
          : 0,
    };
  }, [userTranscriptions, language, userMessages, conversationAnalysis]);

  // Show skeleton if no conversation analysis yet
  if (!conversationAnalysis) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold mb-6">Progress</h2>
          <div className="space-y-8">
            {/* Vocabulary Statistics Skeleton */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Vocabulary statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="bg-[var(--color-card)] border-2 border-[var(--color-border)] rounded-lg p-6 animate-pulse"
                  >
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                    <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                  </div>
                ))}
              </div>
            </div>

            {/* Speaking Statistics Skeleton */}
            <div>
              <h3 className="text-lg font-semibold mb-4">
                Speaking statistics
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2].map((i) => (
                  <div
                    key={i}
                    className="bg-[var(--color-card)] border-2 border-[var(--color-border)] rounded-lg p-6 animate-pulse"
                  >
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                    <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-6">Progress</h2>

        <div className="space-y-8">
          {/* Vocabulary Statistics */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              Vocabulary statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Total words card */}
              <div className="bg-[var(--color-card)] border-2 border-[var(--color-border)] rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <h4 className="font-medium">Total words</h4>
                  <div className="relative group">
                    <div className="w-4 h-4 border-2 border-gray-400 dark:border-gray-400 rounded-full flex items-center justify-center cursor-help">
                      <span className="text-gray-400 dark:text-gray-400 text-xs font-bold">
                        i
                      </span>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                      <div className="text-sm text-[var(--color-foreground)]">
                        How many words your student said during the lesson.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2">
                  {dynamicData.totalWords}
                </div>
              </div>

              {/* New words card */}
              <div className="bg-[var(--color-card)] border-2 border-[var(--color-border)] rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <h4 className="font-medium">New words</h4>
                  <div className="relative group">
                    <div className="w-4 h-4 border-2 border-gray-400 dark:border-gray-400 rounded-full flex items-center justify-center cursor-help">
                      <span className="text-gray-400 dark:text-gray-400 text-xs font-bold">
                        i
                      </span>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                      <div className="text-sm text-[var(--color-foreground)]">
                        Words your student used for the first time in this
                        lesson.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-3xl font-bold mb-2">
                  {dynamicData.newWords}
                </div>
              </div>

              {/* Speaking level card */}
              <div className="bg-[var(--color-card)] border-2 border-[var(--color-border)] rounded-lg p-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Speaking level</h4>
                  <ChevronRight className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                </div>
                <div className="flex items-end justify-between">
                  <div className="mb-2">
                    <div className="text-3xl font-bold mb-1 mt-1">
                      {dynamicData.level}
                    </div>
                    <div className="text-sm text-[var(--color-muted-foreground)]">
                      {dynamicData.level === "A0"
                        ? "Beginner"
                        : dynamicData.level.startsWith("A1")
                        ? "Elementary"
                        : dynamicData.level.startsWith("B1")
                        ? "Intermediate"
                        : dynamicData.level.startsWith("B2")
                        ? "Upper-Intermediate"
                        : dynamicData.level === "C1"
                        ? "Advanced"
                        : "Beginner"}
                    </div>
                  </div>
                  <div className="flex items-end gap-1.5">
                    {[0, 1, 2, 3, 4].map((index) => (
                      <div
                        key={index}
                        className={`w-2.5 rounded ${
                          index === dynamicData.levelIndex
                            ? "bg-pink-500"
                            : "bg-gray-300 dark:bg-gray-600"
                        }`}
                        style={{
                          height: `${12 + index * 2}px`,
                        }}
                      ></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Speaking Statistics */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Speaking statistics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Speaking speed card */}
              <div className="bg-[var(--color-card)] border-2 border-[var(--color-border)] rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <h4 className="font-medium">Speaking speed</h4>
                  <div className="relative group">
                    <div className="w-4 h-4 border-2 border-gray-400 dark:border-gray-400 rounded-full flex items-center justify-center cursor-help">
                      <span className="text-gray-400 dark:text-gray-400 text-xs font-bold">
                        i
                      </span>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                      <div className="text-sm text-[var(--color-foreground)]">
                        Words per minute your student spoke during the lesson.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-3xl font-bold mb-3">
                  {dynamicData.speakingSpeed}{" "}
                  <span className="font-extralight text-xl">WPM</span>
                </div>
                <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
                  {dynamicData.speakingSpeed < 100
                    ? "Your student is speaking at a comfortable pace for language learning."
                    : dynamicData.speakingSpeed < 150
                    ? "Your student's pace falls within the natural range of native speakers. Well done!"
                    : "Your student is speaking very fluently and quickly!"}
                </p>

                {/* Speed range slider */}
                <div className="relative">
                  <div className="flex justify-between text-xs text-[var(--color-muted-foreground)] mb-2">
                    <span>Beginner</span>
                    <span>Just right</span>
                    <span>Fast</span>
                  </div>
                  <div className="flex gap-1 h-4">
                    {/* Beginner segment */}
                    <div className="flex-1 bg-pink-200 rounded-full flex items-center justify-center"></div>
                    {/* Just right segment */}
                    <div className="flex-1 bg-pink-400 rounded-full relative flex items-center justify-center">
                      <div
                        className="absolute top-1/2 transform -translate-y-1/2 w-7 h-7 bg-white rounded-full border border-black"
                        style={{
                          left: `${Math.min(
                            Math.max(
                              dynamicData.speakingSpeed < 60
                                ? 0
                                : dynamicData.speakingSpeed < 100
                                ? ((dynamicData.speakingSpeed - 60) / 40) *
                                  33.33
                                : dynamicData.speakingSpeed < 150
                                ? 33.33 +
                                  ((dynamicData.speakingSpeed - 100) / 50) *
                                    33.33
                                : dynamicData.speakingSpeed < 200
                                ? 66.66 +
                                  ((dynamicData.speakingSpeed - 150) / 50) *
                                    33.33
                                : 100,
                              0
                            ),
                            100
                          )}%`,
                        }}
                      ></div>
                    </div>
                    {/* Fast segment */}
                    <div className="flex-1 bg-pink-600 rounded-full flex items-center justify-center"></div>
                  </div>
                  <div className="flex justify-between text-xs text-[var(--color-muted-foreground)] mt-1">
                    <span>60</span>
                    <span>100</span>
                    <span>150</span>
                    <span>200</span>
                  </div>
                </div>
              </div>

              {/* Speaking time card */}
              <div className="bg-[var(--color-card)] border-2 border-[var(--color-border)] rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                  <h4 className="font-medium">Speaking time</h4>
                  <div className="relative group">
                    <div className="w-4 h-4 border-2 border-gray-400 dark:border-gray-400 rounded-full flex items-center justify-center cursor-help">
                      <span className="text-gray-400 dark:text-gray-400 text-xs font-bold">
                        i
                      </span>
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 px-3 py-2 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10 whitespace-nowrap">
                      <div className="text-sm text-[var(--color-foreground)]">
                        How much time your student spent speaking during the
                        lesson.
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-3xl font-bold mb-4">
                  {dynamicData.userSpeakingTime}{" "}
                  <span className="font-extralight text-2xl">min</span>{" "}
                  <span className="font-light text-xl text-gray-400">
                    ({dynamicData.userPercentage}%)
                  </span>
                </div>

                {/* Legend */}
                <div className="flex gap-4 mb-4 justify-end">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-pink-600 rounded-sm"></div>
                    <span className="text-sm">Lexi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-pink-200 rounded-sm"></div>
                    <span className="text-sm">You</span>
                  </div>
                </div>

                {/* Chart with Y-axis and grid lines */}
                <div className="relative">
                  {/* Y-axis labels */}
                  <div className="absolute left-0 top-0 h-24 flex flex-col justify-between text-xs text-[var(--color-muted-foreground)]">
                    <span className="-mt-2">10 min</span>
                    <span className="mt-2">5 min</span>
                    <span className="mt-2">0 min</span>
                  </div>

                  {/* Grid lines */}
                  <div className="absolute left-12 right-0 h-24">
                    {/* Light mode dashed lines */}
                    <div
                      className="absolute top-0 w-full h-[1.5px] dark:hidden"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(to right, rgb(156, 163, 175) 0px, rgb(156, 163, 175) 10px, transparent 10px, transparent 15px)",
                      }}
                    ></div>
                    <div
                      className="absolute top-1/2 w-full h-[1.5px] dark:hidden"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(to right, rgb(156, 163, 175) 0px, rgb(156, 163, 175) 10px, transparent 10px, transparent 15px)",
                      }}
                    ></div>
                    {/* Dark mode dashed lines */}
                    <div
                      className="absolute top-0 w-full h-[1.5px] hidden dark:block"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(to right, rgb(107, 114, 128) 0px, rgb(107, 114, 128) 10px, transparent 10px, transparent 15px)",
                      }}
                    ></div>
                    <div
                      className="absolute top-1/2 w-full h-[1.5px] hidden dark:block"
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(to right, rgb(107, 114, 128) 0px, rgb(107, 114, 128) 10px, transparent 10px, transparent 15px)",
                      }}
                    ></div>
                    {/* Solid bottom line */}
                    <div className="absolute bottom-0 w-full border-t-[1.5px] border-solid border-gray-400 dark:border-gray-500"></div>
                  </div>

                  {/* Chart area */}
                  <div className="ml-12 h-24 flex items-end justify-between gap-3">
                    {[
                      {
                        date: "Today",
                        you: dynamicData.userSpeakingTime,
                        dmitry: dynamicData.assistantSpeakingTime,
                      },
                      {
                        date: "Today",
                        you: dynamicData.userSpeakingTime,
                        dmitry: dynamicData.assistantSpeakingTime,
                      },
                      {
                        date: "Today",
                        you: dynamicData.userSpeakingTime,
                        dmitry: dynamicData.assistantSpeakingTime,
                      },
                      {
                        date: "Today",
                        you: dynamicData.userSpeakingTime,
                        dmitry: dynamicData.assistantSpeakingTime,
                      },
                      {
                        date: "Today",
                        you: dynamicData.userSpeakingTime,
                        dmitry: dynamicData.assistantSpeakingTime,
                      },
                    ].map((day, index) => {
                      const total = day.you + day.dmitry;
                      const maxHeight = 10; // max minutes for scaling (10 min max)
                      const chartHeight = 90; // height in pixels (slightly less than h-24 to prevent overflow)
                      const barHeight = (total / maxHeight) * chartHeight; // height in pixels
                      const youHeight = (day.you / total) * barHeight;
                      const dmitryHeight = (day.dmitry / total) * barHeight;

                      return (
                        <div
                          key={index}
                          className="flex flex-col items-center gap-2"
                        >
                          {/* Stacked bar */}
                          <div
                            className="w-10 rounded-t-lg"
                            style={{
                              height: `${barHeight}px`,
                              marginBottom: "2px",
                            }}
                          >
                            {/* You segment (top) */}
                            <div
                              className="w-full bg-pink-600 rounded-t-lg"
                              style={{ height: `${youHeight}px` }}
                            ></div>
                            {/* White divider */}
                            {youHeight > 0 && dmitryHeight > 0 && (
                              <div className="w-full h-0.5 bg-white"></div>
                            )}
                            {/* Dmitry segment (bottom) */}
                            <div
                              className="w-full bg-pink-200"
                              style={{ height: `${dmitryHeight}px` }}
                            ></div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Date labels below the chart */}
                  <div className="ml-12 mt-2 flex justify-between gap-3">
                    {[
                      { date: "Today" },
                      { date: "Today" },
                      { date: "Today" },
                      { date: "Today" },
                      { date: "Today" },
                    ].map((day, index) => (
                      <div key={index} className="w-8 flex justify-center">
                        <span className="text-xs text-[var(--color-muted-foreground)] whitespace-nowrap">
                          {day.date}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center pt-6">
        <button
          onClick={onNavigateToRecap}
          className="flex items-center gap-3 px-4 py-3 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg hover:border-black dark:hover:border-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Recap
        </button>
        <button
          onClick={onNavigateToFeedback}
          className="flex items-center gap-3 px-4 py-3 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg hover:border-black dark:hover:border-white transition-colors"
        >
          <span>Feedback</span>
          <span className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
            10
          </span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
