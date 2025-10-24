"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "./ui/button";
import {
  ArrowLeft,
  MessageSquare,
  MoreHorizontal,
  ChevronDown,
  FileText,
} from "lucide-react";
import { PiSquaresFour } from "react-icons/pi";
import OverviewSection from "./OverviewSection";
import OverviewSkeleton from "./OverviewSkeleton";
import RecapSection from "./RecapSection";
import ProgressSection from "./ProgressSection";
import FeedbackSection from "./FeedbackSection";
import VocabularySection from "./VocabularySection";
import CloseButton from "./CloseButton";
import DropdownMenu from "./DropdownMenu";
import { ChatMessage } from "./OpenAIVoiceProvider";
import { saveInsights, ConversationInsights } from "@/utils/insightsStorage";

interface ConversationHistory {
  id: string;
  title: string;
  date: string;
  situation: {
    role: string;
    description: string;
    greeting: string;
    prompt: string;
    image?: string;
  };
}

interface FeedbackPageProps {
  onBack: () => void;
  language: string;
  situation: {
    role: string;
    description: string;
    greeting: string;
    prompt: string;
    image?: string;
  };
  isLoading?: boolean;
  userMessages?: ChatMessage[];
  currentConversation?: ConversationHistory;
  savedInsights?: ConversationInsights;
}

export default function FeedbackPage({
  onBack,
  language,
  situation,
  isLoading = false,
  userMessages = [],
  currentConversation,
  savedInsights,
}: FeedbackPageProps) {
  const [currentView, setCurrentView] = useState<
    "overview" | "recap" | "progress" | "feedback" | "vocabulary"
  >("overview");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Conversation analysis state (lifted from child components)
  const [conversationSummary, setConversationSummary] = useState<{
    summary: string;
    recapPoints: string[];
  } | null>(savedInsights?.summary || null);
  const [conversationAnalysis, setConversationAnalysis] = useState<{
    summary: string;
    level: string;
    topics: Array<{
      title: string;
      points: string[];
    }>;
  } | null>(savedInsights?.analysis || null);
  const [isAnalyzingSummary, setIsAnalyzingSummary] = useState(false);
  const [isAnalyzingDetailed, setIsAnalyzingDetailed] = useState(false);

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }

    if (isMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen]);

  // Generate conversation summary (for OverviewSection)
  useEffect(() => {
    const generateConversationSummary = async () => {
      if (
        !userMessages ||
        userMessages.length === 0 ||
        conversationSummary ||
        savedInsights
      )
        return;

      setIsAnalyzingSummary(true);
      try {
        // Combine all messages into a conversation transcript
        const conversationTranscript = userMessages
          .filter(
            (msg) =>
              msg.type === "user_message" || msg.type === "assistant_message"
          )
          .map(
            (msg) =>
              `${msg.message.role === "user" ? "User" : "Assistant"}: ${
                msg.message.content
              }`
          )
          .join("\n");

        const response = await fetch("/api/analyze-conversation", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transcript: conversationTranscript,
            language: language,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setConversationSummary(data);
        }
      } catch (error) {
        console.error("Failed to generate conversation summary:", error);
      } finally {
        setIsAnalyzingSummary(false);
      }
    };

    generateConversationSummary();
  }, [userMessages, language, conversationSummary]);

  // Generate detailed conversation analysis (for RecapSection)
  useEffect(() => {
    const generateConversationAnalysis = async () => {
      if (
        !userMessages ||
        userMessages.length === 0 ||
        conversationAnalysis ||
        savedInsights
      )
        return;

      setIsAnalyzingDetailed(true);
      try {
        // Combine all messages into a conversation transcript
        const conversationTranscript = userMessages
          .filter(
            (msg) =>
              msg.type === "user_message" || msg.type === "assistant_message"
          )
          .map(
            (msg) =>
              `${msg.message.role === "user" ? "User" : "Assistant"}: ${
                msg.message.content
              }`
          )
          .join("\n");

        const response = await fetch("/api/analyze-conversation-detailed", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            transcript: conversationTranscript,
            language: language,
          }),
        });

        if (response.ok) {
          const data = await response.json();
          setConversationAnalysis(data);
        }
      } catch (error) {
        console.error("Failed to generate conversation analysis:", error);
      } finally {
        setIsAnalyzingDetailed(false);
      }
    };

    generateConversationAnalysis();
  }, [userMessages, language, conversationAnalysis]);

  // Generate dynamic feedback data based on user messages and language
  const feedbackData = useMemo(() => {
    // Use saved feedback data if available
    if (savedInsights?.feedbackData) {
      return savedInsights.feedbackData;
    }
    // Extract user transcriptions
    const userTranscriptions = userMessages
      .filter((msg) => msg.type === "user_message")
      .map((msg) => msg.message.content)
      .join(" ");

    // Calculate total words from user messages
    const totalWords = userTranscriptions
      ? userTranscriptions.split(/\s+/).length
      : 0;

    // Extract unique words for vocabulary
    const words = userTranscriptions
      ? userTranscriptions.toLowerCase().split(/\s+/)
      : [];
    const getCommonWords = (lang: string) => {
      switch (lang) {
        case "fr":
          return [
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
          ];
        case "es":
          return [
            "el",
            "la",
            "los",
            "las",
            "un",
            "una",
            "de",
            "del",
            "y",
            "o",
            "pero",
            "en",
            "con",
            "por",
            "para",
            "es",
            "son",
            "era",
            "fueron",
            "ser",
            "tener",
            "tiene",
            "puede",
            "podría",
            "debería",
            "va",
          ];
        case "de":
          return [
            "der",
            "die",
            "das",
            "ein",
            "eine",
            "und",
            "oder",
            "aber",
            "in",
            "auf",
            "mit",
            "von",
            "für",
            "ist",
            "sind",
            "war",
            "waren",
            "sein",
            "haben",
            "hat",
            "kann",
            "könnte",
            "sollte",
            "wird",
          ];
        case "zh":
          return [
            "的",
            "了",
            "在",
            "是",
            "我",
            "你",
            "他",
            "她",
            "和",
            "与",
            "但",
            "因为",
            "所以",
            "如果",
            "可以",
            "应该",
            "会",
            "要",
            "有",
            "没有",
            "不",
            "很",
            "非常",
          ];
        default: // English
          return [
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
      }
    };

    const commonWords = getCommonWords(language);

    const filteredWords = words.filter(
      (word) =>
        word.length > 3 && !commonWords.includes(word) && /^[a-zA-Z]/.test(word)
    );
    const uniqueWords = Array.from(new Set(filteredWords)).slice(0, 8);

    // Generate dynamic recap based on conversation topics
    const generateRecap = (transcriptions: string, lang: string) => {
      const getNoTranscriptionMessage = (l: string) => {
        switch (l) {
          case "fr":
            return [
              "Aucune transcription disponible",
              "Commencez une conversation pour obtenir des insights",
            ];
          case "es":
            return [
              "No hay transcripción disponible",
              "Comience una conversación para obtener información",
            ];
          case "de":
            return [
              "Keine Transkription verfügbar",
              "Beginnen Sie ein Gespräch, um Einblicke zu erhalten",
            ];
          case "zh":
            return ["没有转录内容", "开始对话以获得见解"];
          default:
            return [
              "No transcription available",
              "Start a conversation to get insights",
            ];
        }
      };

      if (!transcriptions || transcriptions.trim() === "") {
        return getNoTranscriptionMessage(lang);
      }

      const getTopicTranslations = (l: string) => {
        switch (l) {
          case "fr":
            return {
              food: "Discussion sur la nourriture et les repas",
              appearance: "Discussion sur l'apparence et les choix de santé",
              stories: "Partage d'histoires et d'expériences personnelles",
              social: "Débat sur les questions sociales et les valeurs",
              general: "Conversation générale et échange d'idées",
            };
          case "es":
            return {
              food: "Hablando sobre comida y comidas",
              appearance: "Hablando sobre apariencia y decisiones de salud",
              stories: "Compartiendo historias y experiencias personales",
              social: "Debatiendo sobre temas sociales y valores",
              general: "Conversación general e intercambio de ideas",
            };
          case "de":
            return {
              food: "Gespräch über Essen und Mahlzeiten",
              appearance:
                "Gespräch über Aussehen und Gesundheitsentscheidungen",
              stories: "Austausch persönlicher Geschichten und Erfahrungen",
              social: "Debatte über gesellschaftliche Themen und Werte",
              general: "Allgemeines Gespräch und Ideenaustausch",
            };
          case "zh":
            return {
              food: "讨论食物和用餐",
              appearance: "讨论外观和健康选择",
              stories: "分享个人故事和经历",
              social: "讨论社会问题和价值观",
              general: "一般对话和思想交流",
            };
          default: // English
            return {
              food: "Talking about food and meals",
              appearance: "Talking about appearance and health choices",
              stories: "Sharing personal stories and experiences",
              social: "Debating social issues and values",
              general: "General conversation and exchange of ideas",
            };
        }
      };

      const translations = getTopicTranslations(lang);
      const topics = [];

      // Basic topic detection based on keywords (including language-specific keywords)
      if (
        /food|eat|hungry|meal|restaurant|cook|kitchen|comida|comer|essen|kochen|食物|吃|饭|餐厅/i.test(
          transcriptions
        )
      ) {
        topics.push(translations.food);
      }
      if (
        /appearance|look|beautiful|ugly|pretty|attractive|apariencia|hermoso|schön|aussehen|外观|漂亮|美丽/i.test(
          transcriptions
        )
      ) {
        topics.push(translations.appearance);
      }
      if (
        /story|experience|happened|remember|past|historia|experiencia|geschichte|erfahrung|故事|经历|经验/i.test(
          transcriptions
        )
      ) {
        topics.push(translations.stories);
      }
      if (
        /social|society|issue|problem|value|opinion|social|problema|gesellschaft|问题|社会/i.test(
          transcriptions
        )
      ) {
        topics.push(translations.social);
      }

      // If no specific topics detected, provide general feedback
      if (topics.length === 0) {
        topics.push(translations.general);
      }

      return topics;
    };

    // Generate dynamic feedback based on grammar analysis
    const generateFeedback = (transcriptions: string, lang: string) => {
      const getNoTranscriptionFeedback = (l: string) => {
        switch (l) {
          case "fr":
            return [
              {
                type: "Commentaire général",
                text: "Commencez une conversation pour obtenir des commentaires détaillés.",
                highlight: "conversation",
              },
            ];
          case "es":
            return [
              {
                type: "Comentario general",
                text: "Comience una conversación para obtener comentarios detallados.",
                highlight: "conversación",
              },
            ];
          case "de":
            return [
              {
                type: "Allgemeines Feedback",
                text: "Beginnen Sie ein Gespräch, um detailliertes Feedback zu erhalten.",
                highlight: "Gespräch",
              },
            ];
          case "zh":
            return [
              {
                type: "一般反馈",
                text: "开始对话以获得详细反馈。",
                highlight: "对话",
              },
            ];
          default:
            return [
              {
                type: "General feedback",
                text: "Start a conversation to get detailed feedback.",
                highlight: "conversation",
              },
            ];
        }
      };

      if (!transcriptions || transcriptions.trim() === "") {
        return getNoTranscriptionFeedback(lang);
      }

      const getFeedbackTranslations = (l: string) => {
        switch (l) {
          case "fr":
            return {
              questionType: "Forme de question",
              questionText:
                "Vous avez posé des questions pendant la conversation.",
              questionHighlight: "posé des questions",
              pastTenseType: "Temps passé",
              pastTenseText: "Utilisation appropriée du temps passé.",
              pastTenseHighlight: "temps passé",
              generalType: "Commentaire général",
              generalText: "Bonne conversation !",
              generalHighlight: "Bonne conversation",
            };
          case "es":
            return {
              questionType: "Formación de preguntas",
              questionText: "Hiciste preguntas durante la conversación.",
              questionHighlight: "hiciste preguntas",
              pastTenseType: "Tiempo pasado",
              pastTenseText: "Buen uso del tiempo pasado.",
              pastTenseHighlight: "tiempo pasado",
              generalType: "Comentario general",
              generalText: "¡Buena conversación!",
              generalHighlight: "Buena conversación",
            };
          case "de":
            return {
              questionType: "Fragenbildung",
              questionText: "Sie haben Fragen während des Gesprächs gestellt.",
              questionHighlight: "Fragen gestellt",
              pastTenseType: "Vergangenheit",
              pastTenseText: "Gute Verwendung der Vergangenheitsform.",
              pastTenseHighlight: "Vergangenheitsform",
              generalType: "Allgemeines Feedback",
              generalText: "Gutes Gespräch!",
              generalHighlight: "Gutes Gespräch",
            };
          case "zh":
            return {
              questionType: "疑问句形式",
              questionText: "您在对话中提出了问题。",
              questionHighlight: "提出问题",
              pastTenseType: "过去时态",
              pastTenseText: "很好地使用了过去时态。",
              pastTenseHighlight: "过去时态",
              generalType: "一般反馈",
              generalText: "很好的对话！",
              generalHighlight: "很好的对话",
            };
          default: // English
            return {
              questionType: "Question formation",
              questionText: "You asked questions during the conversation.",
              questionHighlight: "asked questions",
              pastTenseType: "Past tense",
              pastTenseText: "Good use of past tense.",
              pastTenseHighlight: "past tense",
              generalType: "General feedback",
              generalText: "Great conversation!",
              generalHighlight: "Great conversation",
            };
        }
      };

      const translations = getFeedbackTranslations(lang);

      // Basic grammar analysis for dynamic feedback
      const sentences = transcriptions
        .split(/[.!?]+/)
        .filter((s) => s.trim().length > 0);
      const feedback = [];

      // Check for question formation (including language-specific question words)
      const questionPatterns = {
        en: /^(what|where|when|why|how|who)/i,
        fr: /^(qu'est-ce|où|quand|pourquoi|comment|qui)/i,
        es: /^(qué|dónde|cuándo|por qué|cómo|quién)/i,
        de: /^(was|wo|wann|warum|wie|wer)/i,
        zh: /^(什么|哪里|何时|为什么|如何|谁)/i,
      };

      const questions = sentences.filter((s) => {
        const pattern =
          questionPatterns[lang as keyof typeof questionPatterns] ||
          questionPatterns.en;
        return pattern.test(s.trim());
      });

      if (questions.length > 0) {
        feedback.push({
          type: translations.questionType,
          text: translations.questionText,
          highlight: translations.questionHighlight,
        });
      }

      // Check for past tense usage (including language-specific patterns)
      const pastTensePatterns = {
        en: /ed\b|was|were|had|would|could|should/i,
        fr: /é|ais|ait|aient|était|fut/i,
        es: /é|aba|ía|ó|ieron|fue/i,
        de: /te|te|ge-.*t|war|wurde/i,
        zh: /了|过|会|要/i,
      };

      const pattern =
        pastTensePatterns[lang as keyof typeof pastTensePatterns] ||
        pastTensePatterns.en;
      if (pattern.test(transcriptions)) {
        feedback.push({
          type: translations.pastTenseType,
          text: translations.pastTenseText,
          highlight: translations.pastTenseHighlight,
        });
      }

      return feedback.length > 0
        ? feedback
        : [
            {
              type: translations.generalType,
              text: translations.generalText,
              highlight: translations.generalHighlight,
            },
          ];
    };

    return {
      recap: generateRecap(userTranscriptions, language),
      progress: {
        speakingTime: { student: 26, teacher: 25 }, // This could be calculated from actual timing data
        totalWords,
        newWords: uniqueWords.length,
      },
      feedback: generateFeedback(userTranscriptions, language),
      vocabulary:
        uniqueWords.length > 0
          ? uniqueWords
          : language === "fr"
          ? ["conversation", "discussion"]
          : ["conversation", "discussion"],
    };
  }, [userMessages, language, savedInsights]);

  // Save insights when both summary and analysis are complete
  useEffect(() => {
    if (
      conversationSummary &&
      conversationAnalysis &&
      currentConversation &&
      !savedInsights
    ) {
      const insights: ConversationInsights = {
        id: currentConversation.id,
        title: currentConversation.title,
        date: currentConversation.date,
        situation: currentConversation.situation,
        language: language,
        summary: conversationSummary,
        analysis: conversationAnalysis,
        userMessages: userMessages,
        feedbackData: feedbackData,
      };
      saveInsights(insights);
    }
  }, [
    conversationSummary,
    conversationAnalysis,
    currentConversation,
    language,
    userMessages,
    feedbackData,
    savedInsights,
  ]);

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      {/* Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            <div>
              <h1 className="text-lg font-semibold">Lesson insights</h1>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                {language === "en"
                  ? "English"
                  : language === "fr"
                  ? "French"
                  : language}
                , {currentConversation?.situation.role || situation.role}
              </p>
            </div>
          </div>
          <div className="text-sm text-[var(--color-muted-foreground)]">
            {new Date().toLocaleDateString()},{" "}
            {new Date().toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-6">
        {/* Title */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <div className="text-sm text-[var(--color-muted-foreground)] mb-2">
              {currentConversation?.date || "Today, 2:30 PM"}
            </div>
            <h1 className="text-5xl font-bold">
              {currentConversation?.situation.role || situation.role}
            </h1>
          </div>
          <div className="flex items-center gap-2 relative" ref={menuRef}>
            {/* Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-700 dark:text-gray-300"
              aria-label="Menu"
            >
              <MoreHorizontal className="h-6 w-6" strokeWidth={2} />
            </button>

            {/* Dropdown Menu */}
            <DropdownMenu
              isOpen={isMenuOpen}
              onClose={() => setIsMenuOpen(false)}
            />

            <CloseButton onClick={onBack} />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-8 mb-4 border-b border-[var(--color-border)]">
          {(() => {
            const getTabLabel = (tabId: string, lang: string) => {
              const labels = {
                recap: {
                  fr: "Résumé",
                  es: "Resumen",
                  de: "Zusammenfassung",
                  zh: "摘要",
                  en: "Recap",
                },
                progress: {
                  fr: "Progrès",
                  es: "Progreso",
                  de: "Fortschritt",
                  zh: "进度",
                  en: "Progress",
                },
                feedback: {
                  fr: "Commentaires",
                  es: "Comentarios",
                  de: "Feedback",
                  zh: "反馈",
                  en: "Feedback",
                },
                vocabulary: {
                  fr: "Vocabulaire",
                  es: "Vocabulario",
                  de: "Wortschatz",
                  zh: "词汇",
                  en: "Vocabulary",
                },
              };
              return (
                labels[tabId as keyof typeof labels]?.[
                  lang as keyof typeof labels.recap
                ] ||
                labels[tabId as keyof typeof labels]?.en ||
                ""
              );
            };

            const tabs = [
              {
                id: "overview",
                label: "",
                count: 4,
                icon: PiSquaresFour,
              },
              {
                id: "recap",
                label: getTabLabel("recap", language),
                count: feedbackData.recap.length,
                icon: null,
              },
              {
                id: "progress",
                label: getTabLabel("progress", language),
                count: 4,
                icon: null,
              },
              {
                id: "feedback",
                label: getTabLabel("feedback", language),
                count: feedbackData.feedback.length,
                icon: null,
              },
              {
                id: "vocabulary",
                label: getTabLabel("vocabulary", language),
                count: feedbackData.vocabulary.length,
                icon: null,
              },
            ];
            return tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setCurrentView(tab.id as any)}
                className={`flex items-center gap-2 pb-4 font-medium ${
                  currentView === tab.id
                    ? "border-b-2 border-pink-500"
                    : "text-[var(--color-muted-foreground)] hover:text-[var(--color-foreground)]"
                }`}
              >
                {tab.id === "overview" && (
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                  </svg>
                )}
                {tab.label}
                <span className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {tab.count}
                </span>
              </button>
            ));
          })()}
        </div>

        {/* Content based on current view */}
        {currentView === "overview" &&
          (isLoading ? (
            <OverviewSkeleton
              onNavigateToRecap={() => setCurrentView("recap")}
              onNavigateToProgress={() => setCurrentView("progress")}
              onNavigateToFeedback={() => setCurrentView("feedback")}
              onNavigateToVocabulary={() => setCurrentView("vocabulary")}
            />
          ) : (
            <OverviewSection
              feedbackData={feedbackData}
              userMessages={userMessages}
              language={language}
              conversationSummary={conversationSummary}
              isAnalyzingSummary={isAnalyzingSummary}
              onNavigateToRecap={() => setCurrentView("recap")}
              onNavigateToProgress={() => setCurrentView("progress")}
              onNavigateToFeedback={() => setCurrentView("feedback")}
              onNavigateToVocabulary={() => setCurrentView("vocabulary")}
            />
          ))}

        {currentView === "recap" && (
          <RecapSection
            onNavigateToOverview={() => setCurrentView("overview")}
            onNavigateToProgress={() => setCurrentView("progress")}
            userMessages={userMessages}
            language={language}
            conversationAnalysis={conversationAnalysis}
            isAnalyzingDetailed={isAnalyzingDetailed}
          />
        )}

        {currentView === "progress" && (
          <ProgressSection
            feedbackData={feedbackData}
            userMessages={userMessages}
            language={language}
            conversationAnalysis={conversationAnalysis}
            onNavigateToRecap={() => setCurrentView("recap")}
            onNavigateToFeedback={() => setCurrentView("feedback")}
          />
        )}

        {currentView === "feedback" && (
          <FeedbackSection
            feedbackData={feedbackData}
            userMessages={userMessages}
            language={language}
            onNavigateToProgress={() => setCurrentView("progress")}
            onNavigateToVocabulary={() => setCurrentView("vocabulary")}
          />
        )}

        {currentView === "vocabulary" && (
          <VocabularySection
            feedbackData={feedbackData}
            onNavigateToFeedback={() => setCurrentView("feedback")}
          />
        )}

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-[var(--color-border)]">
          <div className="flex items-center gap-2 text-sm text-[var(--color-muted-foreground)]">
            <MessageSquare className="h-4 w-4" />
            <span>
              AI-generated insights may contain errors. You can download this
              lesson's audio, delete your data, or manage your preferences in{" "}
              <a
                href="#"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                settings
              </a>{" "}
              anytime.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
