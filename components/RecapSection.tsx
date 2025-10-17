"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

interface RecapSectionProps {
  onNavigateToOverview: () => void;
  onNavigateToProgress: () => void;
}

export default function RecapSection({
  onNavigateToOverview,
  onNavigateToProgress,
}: RecapSectionProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold mb-4">Recap</h2>

        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-3">Summary</h3>
            <p className="text-[var(--color-muted-foreground)] leading-relaxed">
              In this lesson, you had a lively conversation about personal
              experiences, appearance, and important social topics. You
              practiced sharing opinions, telling stories, and discussing
              sensitive issues like bullying and abortion. The lesson helped you
              build confidence in expressing complex ideas and responding
              naturally in conversation.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Topics discussed</h3>
            <div className="space-y-4">
              {[
                {
                  title: "Talking about appearance and health choices",
                  points: [
                    "Discussed wearing glasses versus laser surgery and shared personal opinions on appearance",
                    "Explored vocabulary like 'sight,' 'surgeon,' 'septoplasty,' and 'rhinoplasty'",
                    "Practiced giving compliments and making suggestions politely",
                  ],
                },
                {
                  title: "Sharing personal stories and experiences",
                  points: [
                    "Described growing taller as a teenager and the impact on self-confidence",
                    "Talked about bullying at school and how attitudes change with age",
                    "Practiced storytelling and asking follow-up questions for details",
                  ],
                },
                {
                  title: "Debating social issues and values",
                  points: [
                    "Discussed abortion laws, personal responsibility, and the effects of strict rules",
                    "Explored the meaning of 'self-awareness,' 'obey,' and 'assert oneself'",
                    "Practiced expressing agreement, disagreement, and supporting opinions with examples",
                  ],
                },
              ].map((topic, index) => (
                <div key={index} className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-sm w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                      {index + 1}
                    </span>
                    <h4 className="font-semibold text-lg">{topic.title}</h4>
                  </div>
                  <ul className="ml-9 space-y-2">
                    {topic.points.map((point, pointIndex) => (
                      <li key={pointIndex} className="flex items-start gap-2">
                        <span className="text-[var(--color-muted-foreground)] mt-1.5 flex-shrink-0">
                          •
                        </span>
                        <span className="text-[var(--color-muted-foreground)] text-sm mt-0.5">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
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
