"use client";

import React, { useState, useEffect, useRef } from "react";
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
import RecapSection from "./RecapSection";
import ProgressSection from "./ProgressSection";
import FeedbackSection from "./FeedbackSection";
import VocabularySection from "./VocabularySection";
import CloseButton from "./CloseButton";
import DropdownMenu from "./DropdownMenu";

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
}

export default function FeedbackPage({
  onBack,
  language,
  situation,
}: FeedbackPageProps) {
  const [currentView, setCurrentView] = useState<
    "overview" | "recap" | "progress" | "feedback" | "vocabulary"
  >("overview");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  // Mock conversation history data
  const conversationHistory: ConversationHistory[] = [
    {
      id: "1",
      title: "University life and free speech",
      date: "Today, 2:30 PM",
      situation: situation,
    },
    {
      id: "2",
      title: "Environmental conservation strategies",
      date: "Yesterday, 4:15 PM",
      situation: {
        role: "Environmental Scientist",
        description: "Discussing climate change solutions",
        greeting: "Hello! Let's talk about the environment.",
        prompt:
          "As an environmental scientist, discuss conservation strategies.",
      },
    },
    {
      id: "3",
      title: "Digital marketing trends 2024",
      date: "Dec 18, 11:20 AM",
      situation: {
        role: "Marketing Expert",
        description: "Exploring modern marketing techniques",
        greeting: "Hi! Ready to discuss marketing?",
        prompt: "Share insights about digital marketing trends for 2024.",
      },
    },
  ];

  const [currentConversation, setCurrentConversation] = useState(
    conversationHistory[0]
  );

  // Close menu when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
      if (
        historyRef.current &&
        !historyRef.current.contains(event.target as Node)
      ) {
        setIsHistoryOpen(false);
      }
    }

    if (isMenuOpen || isHistoryOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMenuOpen, isHistoryOpen]);

  // Mock data - in a real app, this would come from the conversation analysis
  const feedbackData = {
    recap: [
      "Talking about appearance and health choices",
      "Sharing personal stories and experiences",
      "Debating social issues and values",
    ],
    progress: {
      speakingTime: { student: 26, teacher: 25 },
      totalWords: 2122,
      newWords: 38,
    },
    feedback: [
      {
        type: "Verb Form",
        text: "...I'm **trying to figure out** the whole story.",
        highlight: "trying to figure out",
      },
      {
        type: "Verb Form",
        text: "...Why **do** you need to cover your face.?",
        highlight: "do",
      },
    ],
    vocabulary: [
      "perspective",
      "person",
      "rehabilitation",
      "liberty",
      "appearance",
      "illegal",
      "accountable",
      "statistic",
    ],
  };

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-foreground)]">
      {/* Header */}
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {/* Conversation History Dropdown */}
            <div className="relative z-50" ref={historyRef}>
              <Button
                onClick={() => setIsHistoryOpen(!isHistoryOpen)}
                variant="ghost"
                className="flex items-center gap-2 rounded-full px-4 py-3 text-lg flex-shrink-0"
              >
                <FileText className="size-5" />
                <span className="-translate-y-[1px] max-w-48 truncate">
                  {currentConversation.title}
                </span>
                <ChevronDown
                  className={`size-5 transition-transform ${
                    isHistoryOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>

              {/* History Dropdown */}
              {isHistoryOpen && (
                <div className="absolute top-full left-0 mt-1 w-80 bg-[var(--color-popover)] border border-[var(--color-border)] rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                  {conversationHistory.map((conversation) => (
                    <button
                      key={conversation.id}
                      onClick={() => {
                        setCurrentConversation(conversation);
                        setIsHistoryOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)] transition-colors first:rounded-t-lg last:rounded-b-lg ${
                        currentConversation.id === conversation.id
                          ? "bg-[var(--color-accent)] text-[var(--color-accent-foreground)]"
                          : ""
                      }`}
                    >
                      <FileText className="h-5 w-5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {conversation.title}
                        </div>
                        <div className="text-xs text-[var(--color-muted-foreground)]">
                          {conversation.date}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

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
                , {currentConversation.situation.role}
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
              {currentConversation.date}
            </div>
            <h1 className="text-5xl font-bold">
              {currentConversation.situation.role}
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
          {[
            {
              id: "overview",
              label: "",
              count: 4,
              icon: PiSquaresFour,
            },
            {
              id: "recap",
              label: "Recap",
              count: feedbackData.recap.length,
              icon: null,
            },
            {
              id: "progress",
              label: "Progress",
              count: 4,
              icon: null,
            },
            {
              id: "feedback",
              label: "Feedback",
              count: feedbackData.feedback.length,
              icon: null,
            },
            {
              id: "vocabulary",
              label: "Vocabulary",
              count: feedbackData.vocabulary.length,
              icon: null,
            },
          ].map((tab) => (
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
          ))}
        </div>

        {/* Content based on current view */}
        {currentView === "overview" && (
          <OverviewSection
            feedbackData={feedbackData}
            onNavigateToRecap={() => setCurrentView("recap")}
            onNavigateToProgress={() => setCurrentView("progress")}
            onNavigateToFeedback={() => setCurrentView("feedback")}
            onNavigateToVocabulary={() => setCurrentView("vocabulary")}
          />
        )}

        {currentView === "recap" && (
          <RecapSection
            onNavigateToOverview={() => setCurrentView("overview")}
            onNavigateToProgress={() => setCurrentView("progress")}
          />
        )}

        {currentView === "progress" && (
          <ProgressSection
            feedbackData={feedbackData}
            onNavigateToRecap={() => setCurrentView("recap")}
            onNavigateToFeedback={() => setCurrentView("feedback")}
          />
        )}

        {currentView === "feedback" && (
          <FeedbackSection
            feedbackData={feedbackData}
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
