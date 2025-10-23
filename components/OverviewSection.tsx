"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "./ui/button";
import { ArrowRight, Star } from "lucide-react";
import { ChatMessage } from "./OpenAIVoiceProvider";

interface OverviewSectionProps {
  feedbackData: {
    recap: string[];
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
    vocabulary: string[];
  };
  userMessages?: ChatMessage[];
  language?: string;
  conversationSummary?: {
    summary: string;
    recapPoints: string[];
  } | null;
  isAnalyzingSummary?: boolean;
  onNavigateToRecap: () => void;
  onNavigateToProgress: () => void;
  onNavigateToFeedback: () => void;
  onNavigateToVocabulary: () => void;
}

export default function OverviewSection({
  feedbackData,
  userMessages = [],
  language = "en",
  conversationSummary,
  isAnalyzingSummary = false,
  onNavigateToRecap,
  onNavigateToProgress,
  onNavigateToFeedback,
  onNavigateToVocabulary,
}: OverviewSectionProps) {
  const [message, setMessage] = useState(
    language === "fr"
      ? "Excellent travail lors de notre leçon aujourd'hui, continuez comme ça!"
      : "Nice job in our lesson today, keep up the great work!"
  );

  // Update message when language changes
  useEffect(() => {
    setMessage(
      language === "fr"
        ? "Excellent travail lors de notre leçon aujourd'hui, continuez comme ça!"
        : "Nice job in our lesson today, keep up the great work!"
    );
  }, [language]);

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
    // Calculate total words from user messages (always calculate, even if 0)
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

    const userSpeakingTime = Math.round((userWords / wordsPerMinute) * 10) / 10;
    const assistantSpeakingTime =
      Math.round((assistantWords / wordsPerMinute) * 10) / 10;

    if (!userTranscriptions || userTranscriptions.trim() === "") {
      return {
        recap: [],
        progress: {
          speakingTime: { student: 0, teacher: 0 },
          totalWords: 0,
          newWords: 0,
        },
        feedback: [],
        vocabulary: [],
      };
    }

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
            "peut",
            "pourrait",
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
    const uniqueWords = Array.from(new Set(filteredWords)).slice(0, 8);

    return {
      recap: [],
      progress: {
        speakingTime: {
          student: userSpeakingTime,
          teacher: assistantSpeakingTime,
        },
        totalWords,
        newWords: uniqueWords.length,
      },
      feedback: [],
      vocabulary: uniqueWords.length > 0 ? uniqueWords : [],
    };
  }, [userTranscriptions, language, feedbackData, userMessages]);

  const hasTranscriptions =
    userTranscriptions && userTranscriptions.trim() !== "";

  // Calculate speaking time for display (using data from dynamicData)
  const userSpeakingTime = dynamicData.progress.speakingTime.student;
  const assistantSpeakingTime = dynamicData.progress.speakingTime.teacher;

  const totalSpeakingTime = userSpeakingTime + assistantSpeakingTime;
  const userPercentage =
    totalSpeakingTime > 0
      ? Math.round((userSpeakingTime / totalSpeakingTime) * 100)
      : 0;
  const assistantPercentage =
    totalSpeakingTime > 0
      ? Math.round((assistantSpeakingTime / totalSpeakingTime) * 100)
      : 0;

  return (
    <>
      <div className="mb-8">
        {conversationSummary?.summary && (
          <p className="text-[var(--color-muted-foreground)] mb-2">
            {conversationSummary.summary}{" "}
            <a
              href="#"
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              {language === "fr" ? "Lire plus" : "Read more"}
            </a>
          </p>
        )}
        {hasTranscriptions && (
          <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
            {language === "fr"
              ? "Basé sur votre conversation"
              : "Based on your conversation"}
          </span>
        )}
      </div>

      {/* Message Section */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
        <h3 className="font-semibold mb-4">
          {language === "fr"
            ? "Ajouter un message pour Lexi"
            : "Add message for Lexi"}
        </h3>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] rounded-lg mb-4 resize-none"
          rows={3}
          placeholder={
            language === "fr"
              ? "Excellent travail lors de notre leçon aujourd'hui, continuez comme ça!"
              : "Nice job in our lesson today, keep up the great work!"
          }
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm text-[var(--color-muted-foreground)]">
              {language === "fr"
                ? "Conseil pro : Un message gentil peut stimuler la motivation de votre étudiant entre les leçons."
                : "Pro tip: A kind message can boost your student's motivation between lessons."}
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
            {language === "fr" ? "Ajouter un message" : "Add message"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recap */}
        <div
          className="bg-[var(--color-card)] border-2 border-[var(--color-border)] rounded-lg p-6 hover:border-black dark:hover:border-white transition-colors cursor-pointer"
          onClick={onNavigateToRecap}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">
                {language === "fr" ? "Résumé" : "Recap"}
              </h3>
              <span className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {conversationSummary?.recapPoints.length ||
                  dynamicData.recap.length}
              </span>
            </div>
            <ArrowRight
              className="h-4 w-4 text-[var(--color-muted-foreground)]"
              onClick={(e) => {
                e.stopPropagation();
                onNavigateToRecap();
              }}
            />
          </div>
          <div className="space-y-3">
            {(conversationSummary?.recapPoints || dynamicData.recap).map(
              (item, index) => (
                <div
                  key={index}
                  className="bg-gray-200 dark:bg-[var(--color-muted)] rounded-lg p-3 flex items-start gap-3"
                >
                  <span className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-sm w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                    {index + 1}
                  </span>
                  <span className="text-sm">{item}</span>
                </div>
              )
            )}
          </div>
        </div>

        {/* Progress */}
        <div
          className="bg-[var(--color-card)] border-2 border-[var(--color-border)] rounded-lg p-6 hover:border-black dark:hover:border-white transition-colors cursor-pointer"
          onClick={onNavigateToProgress}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">
                {language === "fr" ? "Progrès" : "Progress"}
              </h3>
              <span className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                4
              </span>
            </div>
            <ArrowRight
              className="h-4 w-4 text-[var(--color-muted-foreground)]"
              onClick={(e) => {
                e.stopPropagation();
                onNavigateToProgress();
              }}
            />
          </div>
          <div className="space-y-4">
            {/* Speaking time box */}
            <div className="bg-gray-200 dark:bg-[var(--color-muted)] rounded-lg p-4">
              <h4 className="font-medium mb-3">
                {language === "fr" ? "Temps de parole" : "Speaking time"}
              </h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">U</span>
                  </div>
                  <span className="text-sm w-12">
                    {language === "fr" ? "Vous" : "User"}
                  </span>
                  <div className="flex-1 bg-white dark:bg-gray-800 rounded-full h-3">
                    <div
                      className="bg-pink-500 h-3 rounded-full"
                      style={{
                        width: `${userPercentage}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-[var(--color-muted-foreground)] w-20 text-right">
                    {userSpeakingTime} min ({userPercentage}%)
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">L</span>
                  </div>
                  <span className="text-sm w-12">Lexi</span>
                  <div className="flex-1 bg-white dark:bg-gray-800 rounded-full h-3">
                    <div
                      className="bg-gray-400 h-3 rounded-full"
                      style={{
                        width: `${assistantPercentage}%`,
                      }}
                    ></div>
                  </div>
                  <span className="text-sm text-[var(--color-muted-foreground)] w-20 text-right">
                    {assistantSpeakingTime} min ({assistantPercentage}%)
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom row with two smaller boxes */}
            <div className="grid grid-cols-2 gap-3">
              {/* Total words box */}
              <div className="bg-gray-200 dark:bg-[var(--color-muted)] rounded-lg p-3">
                <div className="text-xs text-[var(--color-muted-foreground)] mb-1">
                  {language === "fr" ? "Mots totaux" : "Total words"}
                </div>
                <div className="text-2xl font-bold">
                  {dynamicData.progress.totalWords}
                </div>
              </div>

              {/* New words box */}
              <div className="bg-gray-200 dark:bg-[var(--color-muted)] rounded-lg p-3">
                <div className="text-xs text-[var(--color-muted-foreground)] mb-1">
                  {language === "fr" ? "Nouveaux mots" : "New words"}
                </div>
                <div className="text-2xl font-bold">
                  {dynamicData.progress.newWords}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Feedback */}
        <div
          className="bg-[var(--color-card)] border-2 border-[var(--color-border)] rounded-lg p-6 hover:border-black dark:hover:border-white transition-colors cursor-pointer"
          onClick={onNavigateToFeedback}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">
                {language === "fr" ? "Commentaires" : "Feedback"}
              </h3>
              <span className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {dynamicData.feedback.length}
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-[var(--color-muted-foreground)]" />
          </div>
          <div className="space-y-3">
            {dynamicData.feedback.length === 0 ? (
              <div className="text-center py-8 text-[var(--color-muted-foreground)]">
                {language === "fr"
                  ? "Aucun commentaire disponible"
                  : "No feedback available"}
              </div>
            ) : (
              dynamicData.feedback.map((item: any, index: number) => (
                <div
                  key={index}
                  className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 rounded-lg p-3"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-green-800 dark:text-green-200">
                      {item.type}
                    </span>
                  </div>
                  <p className="text-sm">
                    {item.text.split("**").map((part: string, i: number) =>
                      i % 2 === 1 ? (
                        <span
                          key={i}
                          className="bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 underline font-medium"
                        >
                          {part}
                        </span>
                      ) : (
                        part
                      )
                    )}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Vocabulary */}
        <div
          className="bg-[var(--color-card)] border-2 border-[var(--color-border)] rounded-lg p-6 hover:border-black dark:hover:border-white transition-colors cursor-pointer"
          onClick={onNavigateToVocabulary}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">
                {language === "fr" ? "Vocabulaire" : "Vocabulary"}
              </h3>
              <span className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {dynamicData.vocabulary.length}
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-[var(--color-muted-foreground)]" />
          </div>
          <div className="flex flex-wrap gap-2">
            {dynamicData.vocabulary.length === 0 ? (
              <div className="text-center py-8 text-[var(--color-muted-foreground)] w-full">
                {language === "fr"
                  ? "Aucun vocabulaire disponible"
                  : "No vocabulary available"}
              </div>
            ) : (
              dynamicData.vocabulary.map((word, index) => (
                <span
                  key={index}
                  className="bg-gray-200 dark:bg-[var(--color-muted)] text-[var(--color-muted-foreground)] px-3 py-1 rounded-full text-sm hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)] cursor-pointer transition-colors"
                >
                  {word}
                </span>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
