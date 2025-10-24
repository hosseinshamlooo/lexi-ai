"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import { ChatMessage } from "./OpenAIVoiceProvider";

interface RecapSectionProps {
  onNavigateToOverview: () => void;
  onNavigateToProgress: () => void;
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
  isAnalyzingDetailed?: boolean;
}

export default function RecapSection({
  onNavigateToOverview,
  onNavigateToProgress,
  userMessages = [],
  language = "en",
  conversationAnalysis,
  isAnalyzingDetailed = false,
}: RecapSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Recap</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">
              {language === "fr" ? "Résumé" : "Summary"}
            </h3>
            {conversationAnalysis?.summary ? (
              <p className="text-[var(--color-muted-foreground)] leading-relaxed">
                {conversationAnalysis.summary}
              </p>
            ) : (
              <div className="text-center py-8 text-[var(--color-muted-foreground)]">
                {language === "fr"
                  ? "Analyse de la conversation en cours..."
                  : "Analyzing conversation..."}
              </div>
            )}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">
              {language === "fr" ? "Sujets discutés" : "Topics discussed"}
            </h3>
            <div className="space-y-4">
              {conversationAnalysis?.topics ? (
                conversationAnalysis.topics.map((topic, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex items-start gap-3">
                      <span className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-sm w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                        {index + 1}
                      </span>
                      <h4 className="font-semibold text-lg">
                        {topic.title.replace(/\*\*/g, "")}
                      </h4>
                    </div>
                    <ul className="ml-9 space-y-3">
                      {topic.points.map((point, pointIndex) => (
                        <li key={pointIndex} className="flex items-start gap-3">
                          <span className="text-[var(--color-muted-foreground)] mt-2 flex-shrink-0 text-lg">
                            •
                          </span>
                          <span className="text-[var(--color-muted-foreground)] text-base leading-relaxed">
                            {point.replace(/^-\s*/, "")}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-[var(--color-muted-foreground)]">
                  {language === "fr"
                    ? "Génération des sujets de conversation..."
                    : "Generating conversation topics..."}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center pt-6">
        <button
          onClick={onNavigateToOverview}
          className="flex items-center gap-3 px-4 py-3 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg hover:border-black dark:hover:border-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Overall
        </button>
        <button
          onClick={onNavigateToProgress}
          className="flex items-center gap-3 px-4 py-3 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg hover:border-black dark:hover:border-white transition-colors"
        >
          <span>Progress</span>
          <span className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
            4
          </span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
