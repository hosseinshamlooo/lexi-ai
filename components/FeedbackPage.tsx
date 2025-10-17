"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { ArrowLeft, MessageSquare } from "lucide-react";
import { PiSquaresFour } from "react-icons/pi";
import OverviewSection from "./OverviewSection";
import RecapSection from "./RecapSection";
import ProgressSection from "./ProgressSection";

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
                , {situation.role}
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

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Title */}
        <h1 className="text-3xl font-bold mb-6">{situation.role}</h1>

        {/* Tabs */}
        <div className="flex gap-8 mb-8 border-b border-[var(--color-border)]">
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
              {tab.icon && <tab.icon className="h-5 w-5" />}
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
