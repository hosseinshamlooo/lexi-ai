"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import {
  ArrowLeft,
  ArrowRight,
  MessageSquare,
  TrendingUp,
  Star,
  BookOpen,
  User,
} from "lucide-react";
import { PiSquaresFour } from "react-icons/pi";

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
  const [message, setMessage] = useState(
    "Nice job in our lesson today, keep up the great work!"
  );
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

        {/* Description and Message Section - only for overview */}
        {currentView === "overview" && (
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
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
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
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <Star className="h-4 w-4" />
                    Draft with assistant
                  </Button>
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
          </>
        )}

        {/* Content based on current view */}
        {currentView === "overview" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recap */}
            <div
              className="bg-[var(--color-card)] border-2 border-[var(--color-border)] rounded-lg p-6 hover:border-black dark:hover:border-white transition-colors cursor-pointer"
              onClick={() => setCurrentView("recap")}
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
                    setCurrentView("recap");
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
            <div className="bg-[var(--color-card)] border-2 border-[var(--color-border)] rounded-lg p-6 hover:border-black dark:hover:border-white transition-colors cursor-pointer">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">Progress</h3>
                  <span className="bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    4
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 text-[var(--color-muted-foreground)]" />
              </div>
              <div className="space-y-4">
                {/* Speaking time box */}
                <div className="bg-gray-200 dark:bg-[var(--color-muted)] rounded-lg p-4">
                  <h4 className="font-medium mb-3">Speaking time</h4>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-[var(--color-muted-foreground)]" />
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
                        <User className="h-3 w-3 text-white" />
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
            <div className="bg-[var(--color-card)] border-2 border-[var(--color-border)] rounded-lg p-6 hover:border-black dark:hover:border-white transition-colors cursor-pointer">
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
            <div className="bg-[var(--color-card)] border-2 border-[var(--color-border)] rounded-lg p-6 hover:border-black dark:hover:border-white transition-colors cursor-pointer">
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
        )}

        {/* Recap Section */}
        {currentView === "recap" && (
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
                    sensitive issues like bullying and abortion. The lesson
                    helped you build confidence in expressing complex ideas and
                    responding naturally in conversation.
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">
                    Topics discussed
                  </h3>
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
                          <h4 className="font-semibold text-lg">
                            {topic.title}
                          </h4>
                        </div>
                        <ul className="ml-9 space-y-2">
                          {topic.points.map((point, pointIndex) => (
                            <li
                              key={pointIndex}
                              className="flex items-start gap-2"
                            >
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
                onClick={() => setCurrentView("overview")}
                className="flex items-center gap-3 px-4 py-3 bg-[var(--color-card)] border border-[var(--color-border)] rounded-lg hover:border-black dark:hover:border-white transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Overall
              </button>
              <button
                onClick={() => setCurrentView("progress")}
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
