"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { ArrowRight, Star } from "lucide-react";

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
  onNavigateToRecap: () => void;
  onNavigateToProgress: () => void;
  onNavigateToFeedback: () => void;
  onNavigateToVocabulary: () => void;
}

export default function OverviewSection({
  feedbackData,
  onNavigateToRecap,
  onNavigateToProgress,
  onNavigateToFeedback,
  onNavigateToVocabulary,
}: OverviewSectionProps) {
  const [message, setMessage] = useState(
    "Nice job in our lesson today, keep up the great work!"
  );

  return (
    <>
      <p className="text-[var(--color-muted-foreground)] mb-8">
        In this lesson, you had a lively conversation about personal
        experiences, appearance, and important social topics.{" "}
        <a
          href="#"
          className="text-blue-600 dark:text-blue-400 hover:underline"
        >
          Read more
        </a>
      </p>

      {/* Message Section */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
        <h3 className="font-semibold mb-4">Add message for Lexi</h3>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full p-3 border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-foreground)] rounded-lg mb-4 resize-none"
          rows={3}
          placeholder="Nice job in our lesson today, keep up the great work!"
        />
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <p className="text-sm text-[var(--color-muted-foreground)]">
              Pro tip: A kind message can boost your student's motivation
              between lessons.
            </p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600">
            Add message
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
              <h3 className="font-semibold">Recap</h3>
              <span className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {feedbackData.recap.length}
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
            {feedbackData.recap.map((item, index) => (
              <div
                key={index}
                className="bg-gray-200 dark:bg-[var(--color-muted)] rounded-lg p-3 flex items-start gap-3"
              >
                <span className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-sm w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                  {index + 1}
                </span>
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Progress */}
        <div
          className="bg-[var(--color-card)] border-2 border-[var(--color-border)] rounded-lg p-6 hover:border-black dark:hover:border-white transition-colors cursor-pointer"
          onClick={onNavigateToProgress}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Progress</h3>
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
              <h4 className="font-medium mb-3">Speaking time</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">U</span>
                  </div>
                  <span className="text-sm w-12">User</span>
                  <div className="flex-1 bg-white dark:bg-gray-800 rounded-full h-3">
                    <div
                      className="bg-pink-500 h-3 rounded-full"
                      style={{ width: "51%" }}
                    ></div>
                  </div>
                  <span className="text-sm text-[var(--color-muted-foreground)] w-20 text-right">
                    26 min (51%)
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
                      style={{ width: "49%" }}
                    ></div>
                  </div>
                  <span className="text-sm text-[var(--color-muted-foreground)] w-20 text-right">
                    25 min (49%)
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom row with two smaller boxes */}
            <div className="grid grid-cols-2 gap-3">
              {/* Total words box */}
              <div className="bg-gray-200 dark:bg-[var(--color-muted)] rounded-lg p-3">
                <div className="text-xs text-[var(--color-muted-foreground)] mb-1">
                  Total words
                </div>
                <div className="text-2xl font-bold">
                  {feedbackData.progress.totalWords}
                </div>
              </div>

              {/* New words box */}
              <div className="bg-gray-200 dark:bg-[var(--color-muted)] rounded-lg p-3">
                <div className="text-xs text-[var(--color-muted-foreground)] mb-1">
                  New words
                </div>
                <div className="text-2xl font-bold">
                  {feedbackData.progress.newWords}
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
              <h3 className="font-semibold">Feedback</h3>
              <span className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {feedbackData.feedback.length}
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-[var(--color-muted-foreground)]" />
          </div>
          <div className="space-y-3">
            {feedbackData.feedback.map((item, index) => (
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
                  {item.text.split("**").map((part, i) =>
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
            ))}
          </div>
        </div>

        {/* Vocabulary */}
        <div
          className="bg-[var(--color-card)] border-2 border-[var(--color-border)] rounded-lg p-6 hover:border-black dark:hover:border-white transition-colors cursor-pointer"
          onClick={onNavigateToVocabulary}
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold">Vocabulary</h3>
              <span className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {feedbackData.vocabulary.length}
              </span>
            </div>
            <ArrowRight className="h-4 w-4 text-[var(--color-muted-foreground)]" />
          </div>
          <div className="flex flex-wrap gap-2">
            {feedbackData.vocabulary.map((word, index) => (
              <span
                key={index}
                className="bg-gray-200 dark:bg-[var(--color-muted)] text-[var(--color-muted-foreground)] px-3 py-1 rounded-full text-sm hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)] cursor-pointer transition-colors"
              >
                {word}
              </span>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
