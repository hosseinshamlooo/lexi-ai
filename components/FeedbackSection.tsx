"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Play, Info } from "lucide-react";

interface FeedbackSectionProps {
  feedbackData: {
    feedback: Array<{
      type: string;
      text: string;
      highlight: string;
    }>;
  };
  onNavigateToProgress: () => void;
  onNavigateToVocabulary: () => void;
}

export default function FeedbackSection({
  feedbackData,
  onNavigateToProgress,
  onNavigateToVocabulary,
}: FeedbackSectionProps) {
  const [pronunciationFeedback, setPronunciationFeedback] = useState([
    {
      phrase: "... also **thinking** about ...",
      phonetic: "→ also /ˈθɪŋkɪŋ/ about",
      score: 11,
      word: "thinking",
    },
    {
      phrase: "... can **definitely** think ...",
      phonetic: "→ can /ˈdɛfənətli/ think",
      score: 17,
      word: "definitely",
    },
    {
      phrase: "... just **normal** behavior ...",
      phonetic: "→ just /ˈnɔrməl/ behavior",
      score: 22,
      word: "normal",
    },
    {
      phrase: "I'm **talking** with ...",
      phonetic: "→ I'm /ˈtɔkɪŋ/ with",
      score: 29,
      word: "talking",
    },
  ]);

  const grammarFeedback = {
    didWell: [
      {
        type: "Verb form",
        phrase: "...I'm trying to figure out the whole story.",
        explanation:
          "Great job using the present continuous tense to express an ongoing action!",
        highlighted: "trying to figure out",
      },
    ],
    canImprove: [
      {
        type: "Verb form",
        original: "...Why you need to cover your face.",
        originalHighlighted: "need",
        correction: "→ Why do you need to cover your face?",
        correctionHighlighted: "do",
        explanation: "Added 'do' to form a question correctly.",
        highlighted: "do",
      },
      {
        type: "Noun singular or plural, Subject verb agreement",
        original: "...I know a lot of person who looks worse than you.",
        originalHighlighted: "person,looks",
        correction: "→ I know a lot of people who look worse than you.",
        correctionHighlighted: "people,look",
        explanation:
          "Changed 'person' to 'people' for plural agreement and 'looks' to 'look' for subject-verb agreement.",
        highlighted: "people,look",
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Feedback</h2>

        {/* Speaking feedback section */}
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Speaking feedback</h3>

          {/* Info box */}
          <div className="bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 flex items-start gap-3">
            <Info className="h-5 w-5 text-gray-600 dark:text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Feedback and examples use American English. More accents coming
              soon.
            </p>
          </div>

          {/* Pronunciation practice cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {pronunciationFeedback.map((item, index) => (
              <div
                key={index}
                className="bg-[var(--color-background)] border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                    Practice pronunciation
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="text-sm">
                    <span
                      dangerouslySetInnerHTML={{
                        __html: item.phrase.replace(
                          /\*\*(.*?)\*\*/g,
                          '<span style="text-decoration: underline; text-decoration-style: wavy; color: #f59e0b; background-color: rgba(245, 158, 11, 0.1);">$1</span>'
                        ),
                      }}
                    />
                  </div>

                  <div className="text-sm text-gray-600 dark:text-gray-400 font-mono">
                    {item.phonetic}
                  </div>

                  <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-3 py-2 bg-[var(--color-background)] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors border-2 border-black dark:border-white">
                      <Play className="h-4 w-4" />
                      You
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-[var(--color-background)] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors border-2 border-black dark:border-white">
                      <Play className="h-4 w-4" />
                      Example
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grammar feedback section */}
        <div className="space-y-6 mt-8">
          <h3 className="text-lg font-semibold">Grammar feedback</h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* What they did well */}
            <div className="space-y-4">
              <h4 className="text-base font-medium text-green-700 dark:text-green-400">
                What Dmitry did well
              </h4>

              {grammarFeedback.didWell.map((item, index) => (
                <div
                  key={index}
                  className="bg-[var(--color-background)] border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-green-700 dark:text-green-400">
                      {item.type}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="text-sm">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: item.phrase.replace(
                            new RegExp(`(${item.highlighted})`, "gi"),
                            '<span style="background-color: rgba(34, 197, 94, 0.2); color: #16a34a;">$1</span>'
                          ),
                        }}
                      />
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* What they can improve */}
            <div className="space-y-4">
              <h4 className="text-base font-medium text-yellow-700 dark:text-yellow-400">
                What Dmitry can improve
              </h4>

              {grammarFeedback.canImprove.map((item, index) => (
                <div
                  key={index}
                  className="bg-[var(--color-background)] border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6"
                >
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                      {item.type}
                    </span>
                  </div>

                  <div className="space-y-4">
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: item.originalHighlighted
                            ? item.originalHighlighted
                                .split(",")
                                .reduce((html, highlight) => {
                                  const regex = new RegExp(
                                    `(${highlight.trim()})`,
                                    "gi"
                                  );
                                  return html.replace(
                                    regex,
                                    '<span style="background-color: rgba(250, 204, 21, 0.3); color: #ca8a04;">$1</span>'
                                  );
                                }, item.original)
                            : item.original,
                        }}
                      />
                    </div>

                    <div className="text-sm">
                      <span
                        dangerouslySetInnerHTML={{
                          __html: item.correctionHighlighted
                            ? item.correctionHighlighted
                                .split(",")
                                .reduce((html, highlight) => {
                                  const regex = new RegExp(
                                    `(${highlight.trim()})`,
                                    "gi"
                                  );
                                  return html.replace(
                                    regex,
                                    "<strong>$1</strong>"
                                  );
                                }, item.correction)
                            : item.correction,
                        }}
                      />
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.explanation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between items-center pt-6">
        <button
          onClick={onNavigateToProgress}
          className="flex items-center gap-3 px-4 py-3 bg-[var(--color-card)] border-2 border-[var(--color-border)] rounded-lg hover:border-black dark:hover:border-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Progress
        </button>
        <button
          onClick={onNavigateToVocabulary}
          className="flex items-center gap-3 px-4 py-3 bg-[var(--color-card)] border-2 border-[var(--color-border)] rounded-lg hover:border-black dark:hover:border-white transition-colors"
        >
          <span>Vocabulary</span>
          <span className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
            8
          </span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
