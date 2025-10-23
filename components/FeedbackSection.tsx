"use client";

import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, ArrowRight, Play, Info } from "lucide-react";
import { ChatMessage } from "./OpenAIVoiceProvider";

interface GrammarIssue {
  type: string;
  original: string;
  originalHighlighted: string;
  correction: string;
  correctionHighlighted: string;
  explanation: string;
  highlighted: string;
}

interface FeedbackSectionProps {
  feedbackData: {
    feedback: Array<{
      type: string;
      text: string;
      highlight: string;
    }>;
  };
  userMessages?: ChatMessage[];
  language: string;
  onNavigateToProgress: () => void;
  onNavigateToVocabulary: () => void;
}

export default function FeedbackSection({
  feedbackData,
  userMessages = [],
  language,
  onNavigateToProgress,
  onNavigateToVocabulary,
}: FeedbackSectionProps) {
  // Helper function to get language-appropriate static pronunciation feedback
  const getStaticPronunciationFeedback = (lang: string) => {
    return lang === "fr"
      ? [
          {
            phrase: "... aussi **réfléchir** à ...",
            phonetic: "→ aussi /ʁefleʃiʁ/ à",
            score: 11,
            word: "réfléchir",
          },
          {
            phrase: "... peut **définitivement** penser ...",
            phonetic: "→ peut /definitivmɑ̃/ penser",
            score: 17,
            word: "définitivement",
          },
          {
            phrase: "... juste un **comportement** normal ...",
            phonetic: "→ juste un /kɔ̃pɔʁtəmɑ̃/ normal",
            score: 22,
            word: "comportement",
          },
          {
            phrase: "Je **parle** avec ...",
            phonetic: "→ Je /paʁl/ avec",
            score: 29,
            word: "parle",
          },
        ]
      : [
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
        ];
  };

  // Use useMemo to make pronunciation feedback reactive to language changes
  const staticPronunciationFeedback = useMemo(
    () => getStaticPronunciationFeedback(language),
    [language]
  );

  // Helper function to get language-appropriate static grammar feedback
  const getStaticGrammarFeedback = (lang: string) => {
    return lang === "fr"
      ? {
          didWell: [
            {
              type: "Forme verbale",
              phrase: "...J'essaie de comprendre toute l'histoire.",
              explanation:
                "Excellent travail en utilisant le présent continu pour exprimer une action en cours!",
              highlighted: "essaie de comprendre",
            },
          ],
          canImprove: [
            {
              type: "Forme verbale",
              original: "...Pourquoi tu as besoin de couvrir ton visage.",
              originalHighlighted: "besoin",
              correction: "→ Pourquoi as-tu besoin de couvrir ton visage?",
              correctionHighlighted: "as",
              explanation: "Ajouté 'as' pour former une question correctement.",
              highlighted: "as",
            },
            {
              type: "Noms singuliers ou pluriels, Accord sujet-verbe",
              original:
                "...Je connais beaucoup de personne qui a l'air pire que toi.",
              originalHighlighted: "personne,a",
              correction:
                "→ Je connais beaucoup de personnes qui ont l'air pire que toi.",
              correctionHighlighted: "personnes,ont",
              explanation:
                "Changé 'personne' en 'personnes' pour l'accord pluriel et 'a' en 'ont' pour l'accord sujet-verbe.",
              highlighted: "personnes,ont",
            },
          ],
        }
      : {
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
  };

  // Use useMemo to make grammar feedback reactive to language changes
  const staticGrammarFeedback = useMemo(
    () => getStaticGrammarFeedback(language),
    [language]
  );

  // Extract user messages only for transcription analysis
  const userTranscriptions = useMemo(() => {
    const transcriptions = userMessages
      .filter((msg) => msg.type === "user_message")
      .map((msg) => msg.message.content)
      .join(" ");

    return transcriptions;
  }, [userMessages]);

  // Generate dynamic feedback based on user transcriptions
  const dynamicFeedback = useMemo(() => {
    if (!userTranscriptions || userTranscriptions.trim() === "") {
      // When no transcriptions, provide encouraging message to start conversation
      return {
        pronunciationFeedback: [
          {
            phrase:
              language === "fr"
                ? "Commencez une conversation pour obtenir des commentaires de prononciation"
                : "Start a conversation to get pronunciation feedback",
            phonetic:
              language === "fr"
                ? "→ Pratiquez en parlant avec Lexi"
                : "→ Practice by speaking with Lexi",
            score: 0,
            word: "conversation",
          },
        ],
        grammarFeedback: {
          didWell: [
            {
              type: language === "fr" ? "Prêt à commencer" : "Ready to start",
              phrase:
                language === "fr"
                  ? "Vous êtes prêt à commencer votre conversation !"
                  : "You're ready to start your conversation!",
              explanation:
                language === "fr"
                  ? "Commencez à parler pour obtenir des commentaires personnalisés."
                  : "Start speaking to get personalized feedback.",
              highlighted: language === "fr" ? "prêt" : "ready",
            },
          ],
          canImprove: [],
        },
      };
    }

    // Basic feedback generation logic - in a real app, this would call an AI service
    const words = userTranscriptions.toLowerCase().split(/\s+/);
    const commonWords =
      language === "fr"
        ? [
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
            "peut",
            "pourrait",
          ]
        : [
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

    // Find potential pronunciation issues (words that might be challenging)
    const challengingWords = words
      .filter(
        (word) =>
          word.length > 6 &&
          !commonWords.includes(word) &&
          /[^a-zA-Z]/.test(word.toLowerCase()) === false
      )
      .slice(0, 4);

    const pronunciationItems =
      challengingWords.length > 0
        ? challengingWords.map((word, index) => ({
            phrase: `...${word}...`,
            phonetic: `→ /${word}/`,
            score: Math.floor(Math.random() * 30) + 10,
            word: word,
          }))
        : [
            // If no challenging words found, provide general feedback
            {
              phrase:
                language === "fr"
                  ? "Excellent travail de prononciation!"
                  : "Great job speaking clearly!",
              phonetic:
                language === "fr"
                  ? "→ Continuez à pratiquer la prononciation"
                  : "→ Keep practicing pronunciation",
              score: 25,
              word: "general",
            },
          ];

    // Basic grammar analysis
    const sentences = userTranscriptions
      .split(/[.!?]+/)
      .filter((s) => s.trim().length > 0);
    const grammarIssues: GrammarIssue[] = [];

    // Check for common issues
    sentences.forEach((sentence) => {
      const trimmedSentence = sentence.trim();
      // Check for missing auxiliary verbs in questions
      if (
        /^(what|where|when|why|how|who)/i.test(trimmedSentence) &&
        !/\b(do|does|did|is|are|was|were|can|could|will|would)\b/i.test(
          trimmedSentence
        )
      ) {
        grammarIssues.push({
          type: "Question formation",
          original: trimmedSentence,
          originalHighlighted: trimmedSentence.split(/\s+/)[0],
          correction: `→ ${trimmedSentence}`,
          correctionHighlighted: "auxiliary verb needed",
          explanation: "Questions need auxiliary verbs.",
          highlighted: "auxiliary verb needed",
        });
      }
    });

    return {
      pronunciationFeedback: pronunciationItems,
      grammarFeedback: {
        didWell:
          grammarIssues.length === 0
            ? [
                {
                  type:
                    language === "fr"
                      ? "Grammaire générale"
                      : "Overall grammar",
                  phrase:
                    language === "fr"
                      ? "Votre grammaire était excellente tout au long de la conversation!"
                      : "Your grammar was excellent throughout the conversation!",
                  explanation:
                    language === "fr"
                      ? "Excellent travail avec la structure des phrases et la grammaire."
                      : "Great job using proper sentence structure and grammar.",
                  highlighted: language === "fr" ? "excellente" : "excellent",
                },
              ]
            : [],
        canImprove: grammarIssues.slice(0, 2),
      },
    };
  }, [userTranscriptions, language]);

  // Only use dynamic feedback based on transcriptions - no static fallback
  const hasTranscriptions =
    userTranscriptions && userTranscriptions.trim() !== "";

  const finalPronunciationFeedback = dynamicFeedback.pronunciationFeedback;
  const finalGrammarFeedback = dynamicFeedback.grammarFeedback;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">
          {language === "fr" ? "Commentaires" : "Feedback"}
        </h2>

        {/* Speaking feedback section */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">
              {language === "fr" ? "Commentaires oraux" : "Speaking feedback"}
            </h3>
            {hasTranscriptions && (
              <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                {language === "fr"
                  ? "Basé sur votre conversation"
                  : "Based on your conversation"}
              </span>
            )}
          </div>

          {/* Info box */}
          <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg p-4 flex items-start gap-3">
            <Info className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-700 dark:text-amber-300">
              {language === "fr"
                ? "Les commentaires et exemples utilisent le français. Plus d'accents bientôt."
                : "Feedback and examples use American English. More accents coming soon."}
            </p>
          </div>

          {/* Pronunciation practice cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {finalPronunciationFeedback.map((item, index) => (
              <div
                key={index}
                className="bg-[var(--color-background)] border-2 border-gray-300 dark:border-gray-600 rounded-lg p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm font-medium text-amber-600 dark:text-amber-400">
                    {language === "fr"
                      ? "Pratiquer la prononciation"
                      : "Practice pronunciation"}
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
                      {language === "fr" ? "Vous" : "You"}
                    </button>
                    <button className="flex items-center gap-2 px-3 py-2 bg-[var(--color-background)] hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-sm font-medium transition-colors border-2 border-black dark:border-white">
                      <Play className="h-4 w-4" />
                      {language === "fr" ? "Exemple" : "Example"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grammar feedback section */}
        <div className="space-y-6 mt-8">
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-semibold">
              {language === "fr"
                ? "Commentaires de grammaire"
                : "Grammar feedback"}
            </h3>
            {hasTranscriptions && (
              <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-1 rounded-full">
                {language === "fr"
                  ? "Basé sur votre conversation"
                  : "Based on your conversation"}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* What they did well */}
            <div className="space-y-4">
              <h4 className="text-base font-medium text-green-700 dark:text-green-400">
                {language === "fr"
                  ? "Ce que Dmitry a bien fait"
                  : "What Dmitry did well"}
              </h4>

              {finalGrammarFeedback.didWell.map((item, index) => (
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
                {language === "fr"
                  ? "Ce que Dmitry peut améliorer"
                  : "What Dmitry can improve"}
              </h4>

              {finalGrammarFeedback.canImprove.map((item, index) => (
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
                                .reduce((html: string, highlight: string) => {
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
                                .reduce((html: string, highlight: string) => {
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
