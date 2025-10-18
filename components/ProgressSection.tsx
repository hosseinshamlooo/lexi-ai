"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";

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
  onNavigateToRecap: () => void;
  onNavigateToFeedback: () => void;
}

export default function ProgressSection({
  feedbackData,
  onNavigateToRecap,
  onNavigateToFeedback,
}: ProgressSectionProps) {
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <div className="text-3xl font-bold mb-2">2122</div>
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
                <div className="text-3xl font-bold mb-2">38</div>
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
                  134 <span className="font-extralight text-xl">WPM</span>
                </div>
                <p className="text-sm text-[var(--color-muted-foreground)] mb-4">
                  Your student's pace falls within the natural range of native
                  speakers. Well done!
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
                      <div className="absolute top-1/2 right-2 transform -translate-y-1/2 w-7 h-7 bg-white rounded-full border border-black"></div>
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
                  26 <span className="font-extralight text-2xl">min</span>{" "}
                  <span className="font-light text-xl text-gray-400">
                    (51%)
                  </span>
                </div>

                {/* Legend */}
                <div className="flex gap-4 mb-4 justify-end">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-pink-600 rounded"></div>
                    <span className="text-sm">Lexi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-pink-200 rounded"></div>
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
                      { date: "Sep 1", you: 3, dmitry: 5 },
                      { date: "Sep 2", you: 3, dmitry: 5 },
                      { date: "Sep 5", you: 3, dmitry: 4 },
                      { date: "Sep 10", you: 3, dmitry: 3 },
                      { date: "Sep 15", you: 4, dmitry: 4 },
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
                      { date: "Sep 1" },
                      { date: "Sep 2" },
                      { date: "Sep 5" },
                      { date: "Sep 10" },
                      { date: "Sep 15" },
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
