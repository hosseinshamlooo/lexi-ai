"use client";

import { ArrowRight } from "lucide-react";

interface OverviewSkeletonProps {
  onNavigateToRecap: () => void;
  onNavigateToProgress: () => void;
  onNavigateToFeedback: () => void;
  onNavigateToVocabulary: () => void;
}

export default function OverviewSkeleton({
  onNavigateToRecap,
  onNavigateToProgress,
  onNavigateToFeedback,
  onNavigateToVocabulary,
}: OverviewSkeletonProps) {
  return (
    <>
      {/* Description skeleton */}
      <div className="mb-8">
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2 animate-pulse"></div>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 animate-pulse"></div>
      </div>

      {/* Message Section skeleton */}
      <div className="bg-blue-50 dark:bg-blue-950/30 border-2 border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
        <div className="h-5 bg-gray-300 dark:bg-gray-600 rounded w-48 mb-4 animate-pulse"></div>
        <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded animate-pulse mb-4"></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-64 animate-pulse"></div>
          </div>
          <div className="h-9 w-24 bg-gray-300 dark:bg-gray-600 rounded animate-pulse"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Recap skeleton */}
        <div className="bg-[var(--color-card)] border-2 border-[var(--color-border)] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-16 animate-pulse"></div>
            </div>
            <ArrowRight className="h-4 w-4 text-[var(--color-muted-foreground)] opacity-50" />
          </div>
          <div className="h-32 bg-gray-200 dark:bg-[var(--color-muted)] rounded-lg animate-pulse"></div>
        </div>

        {/* Progress skeleton */}
        <div className="bg-[var(--color-card)] border-2 border-[var(--color-border)] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
            </div>
            <ArrowRight className="h-4 w-4 text-[var(--color-muted-foreground)] opacity-50" />
          </div>
          <div className="h-32 bg-gray-200 dark:bg-[var(--color-muted)] rounded-lg animate-pulse"></div>
        </div>

        {/* Feedback skeleton */}
        <div className="bg-[var(--color-card)] border-2 border-[var(--color-border)] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-20 animate-pulse"></div>
            </div>
            <ArrowRight className="h-4 w-4 text-[var(--color-muted-foreground)] opacity-50" />
          </div>
          <div className="h-32 bg-gray-200 dark:bg-[var(--color-muted)] rounded-lg animate-pulse"></div>
        </div>

        {/* Vocabulary skeleton */}
        <div className="bg-[var(--color-card)] border-2 border-[var(--color-border)] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse"></div>
            </div>
            <ArrowRight className="h-4 w-4 text-[var(--color-muted-foreground)] opacity-50" />
          </div>
          <div className="h-32 bg-gray-200 dark:bg-[var(--color-muted)] rounded-lg animate-pulse"></div>
        </div>
      </div>
    </>
  );
}
