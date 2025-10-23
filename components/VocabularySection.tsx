"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Volume2,
  Bookmark,
  Layers,
} from "lucide-react";

interface VocabularySectionProps {
  feedbackData: {
    vocabulary: string[];
  };
  language?: string;
  onNavigateToFeedback: () => void;
}

interface VocabularyWord {
  word: string;
  partOfSpeech: string;
  level: string;
  definition: string;
  exampleFromLesson: string;
  exampleGeneral: string;
}

interface SynonymPair {
  original: string;
  synonym: string;
  context: string;
  explanation: string;
}

export default function VocabularySection({
  feedbackData,
  onNavigateToFeedback,
}: VocabularySectionProps) {
  const [expandedWords, setExpandedWords] = useState<Set<string>>(new Set());
  const [expandedSynonyms, setExpandedSynonyms] = useState<Set<string>>(
    new Set()
  );

  // Mock vocabulary data with expanded information
  const vocabularyWords: VocabularyWord[] = [
    {
      word: "messy",
      partOfSpeech: "Adjective",
      level: "A2",
      definition: "Untidy or disorganized in appearance or arrangement.",
      exampleFromLesson: "My room is the messiest one.",
      exampleGeneral:
        "Her room was always messy, with clothes strewn everywhere.",
    },
    {
      word: "responsible",
      partOfSpeech: "Adjective",
      level: "B1",
      definition:
        "Having an obligation to do something, or having control over or care for someone.",
      exampleFromLesson: "I need to be more responsible with my time.",
      exampleGeneral: "Parents are responsible for their children's safety.",
    },
    {
      word: "responsibility",
      partOfSpeech: "Noun",
      level: "B2",
      definition:
        "The state or fact of having a duty to deal with something or having control over someone.",
      exampleFromLesson: "Taking responsibility is important in life.",
      exampleGeneral: "It's my responsibility to look after my younger sister.",
    },
    {
      word: "organized",
      partOfSpeech: "Adjective",
      level: "B2",
      definition: "Arranged in a systematic way, especially on a large scale.",
      exampleFromLesson: "She's very organized with her schedule.",
      exampleGeneral: "An organized desk helps with productivity.",
    },
    {
      word: "perspective",
      partOfSpeech: "Noun",
      level: "C1",
      definition:
        "A particular attitude towards or way of regarding something; a point of view.",
      exampleFromLesson: "Let me give you a different perspective on this.",
      exampleGeneral: "The book offers a fresh perspective on modern art.",
    },
    {
      word: "frustrate",
      partOfSpeech: "Verb",
      level: "B2",
      definition:
        "Prevent (a plan or attempted action) from progressing, succeeding, or being fulfilled.",
      exampleFromLesson: "This situation really frustrates me.",
      exampleGeneral: "Technical problems can frustrate users.",
    },
    {
      word: "demonstrate",
      partOfSpeech: "Verb",
      level: "B2",
      definition:
        "Clearly show the existence or truth of (something) by giving proof or evidence.",
      exampleFromLesson: "Let me demonstrate how this works.",
      exampleGeneral:
        "The study demonstrates the effectiveness of the treatment.",
    },
    {
      word: "judgmental",
      partOfSpeech: "Adjective",
      level: "B2",
      definition: "Having or displaying an excessively critical point of view.",
      exampleFromLesson: "Try not to be too judgmental about their choices.",
      exampleGeneral: "A judgmental attitude can harm relationships.",
    },
  ];

  // Mock synonyms data
  const synonymPairs: SynonymPair[] = [
    {
      original: "okay",
      synonym: "alright",
      context: "But now it's okay.",
      explanation:
        "You used the word 'okay' in this sentence. Consider using 'alright' to enrich your active vocabulary!",
    },
    {
      original: "anxious",
      synonym: "nervous",
      context: "I feel anxious about the presentation.",
      explanation:
        "You used the word 'anxious' here. 'Nervous' is a good alternative that's slightly more common.",
    },
    {
      original: "takes",
      synonym: "requires",
      context: "This task takes a lot of effort.",
      explanation:
        "You used 'takes' in this context. 'Requires' would be more formal and precise.",
    },
  ];

  const toggleWordExpansion = (word: string) => {
    const newExpanded = new Set(expandedWords);
    if (newExpanded.has(word)) {
      newExpanded.delete(word);
    } else {
      newExpanded.add(word);
    }
    setExpandedWords(newExpanded);
  };

  const toggleSynonymExpansion = (synonymKey: string) => {
    const newExpanded = new Set(expandedSynonyms);
    if (newExpanded.has(synonymKey)) {
      newExpanded.delete(synonymKey);
    } else {
      newExpanded.add(synonymKey);
    }
    setExpandedSynonyms(newExpanded);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-6">Vocabulary</h2>

        {/* Save all words section */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-700 rounded-lg p-4 flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <Bookmark className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="font-semibold">Save all words to your vocab</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[var(--color-background)] border-2 border-black dark:border-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            Save all words ({vocabularyWords.length})
          </button>
        </div>

        {/* Key vocabulary section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Key vocabulary</h3>

          <div className="space-y-2">
            {vocabularyWords.map((wordData) => {
              const isExpanded = expandedWords.has(wordData.word);

              return (
                <div
                  key={wordData.word}
                  className="bg-[var(--color-background)] border-2 border-gray-300 dark:border-gray-600 rounded-lg"
                >
                  {/* Always visible header */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors border-2 border-blue-600 dark:border-blue-400">
                        <Volume2 className="h-5 w-5 text-blue-600 dark:text-blue-400 stroke-[3]" />
                      </button>
                      <div>
                        <span className="font-medium text-lg">
                          {wordData.word}
                        </span>
                        {isExpanded ? (
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {wordData.partOfSpeech} - {wordData.level}
                          </p>
                        ) : (
                          <div className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-xs rounded-full ml-2 inline-block">
                            {wordData.level}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {isExpanded && (
                        <button className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors border border-gray-300 dark:border-gray-600">
                          <Bookmark className="h-4 w-4 stroke-[3]" />
                          Save to vocab
                        </button>
                      )}
                      {!isExpanded && (
                        <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors">
                          <Bookmark className="h-4 w-4 text-gray-600 dark:text-gray-400 stroke-[3]" />
                        </button>
                      )}
                      <button
                        onClick={() => toggleWordExpansion(wordData.word)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-400 stroke-[3]" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400 stroke-[3]" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Collapsible content with animation */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded
                        ? "max-h-[500px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="p-4 pt-0 space-y-4">
                      <p className="text-[var(--color-foreground)]">
                        {wordData.definition}
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm">
                          <span className="italic">From your lesson: </span>
                          <span className="italic">
                            "{wordData.exampleFromLesson}"
                          </span>
                        </p>
                        <p className="text-sm">{wordData.exampleGeneral}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Synonyms section */}
        <div className="space-y-4 mt-8">
          <h3 className="text-lg font-semibold">Synonyms</h3>

          <div className="space-y-2">
            {synonymPairs.map((synonymPair, index) => {
              const synonymKey = `${synonymPair.original}-${synonymPair.synonym}`;
              const isExpanded = expandedSynonyms.has(synonymKey);

              return (
                <div
                  key={synonymKey}
                  className="bg-[var(--color-background)] border-2 border-gray-300 dark:border-gray-600 rounded-lg"
                >
                  {/* Always visible header */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center">
                        <Layers className="h-4 w-4 text-gray-600 dark:text-gray-400 stroke-[3]" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-lg">
                          {synonymPair.original}
                        </span>
                        <span className="text-gray-400">↔</span>
                        <span className="font-medium text-lg text-blue-600 underline">
                          {synonymPair.synonym}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleSynonymExpansion(synonymKey)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-5 w-5 text-gray-600 dark:text-gray-400 stroke-[3]" />
                        ) : (
                          <ChevronDown className="h-5 w-5 text-gray-600 dark:text-gray-400 stroke-[3]" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Collapsible content with animation */}
                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isExpanded
                        ? "max-h-[500px] opacity-100"
                        : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="p-4 pt-0 space-y-4">
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          You said
                        </p>
                        <p className="text-sm">"{synonymPair.context}"</p>
                        <div className="space-y-1">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Synonym
                          </p>
                          <p
                            className="text-sm"
                            dangerouslySetInnerHTML={{
                              __html: `"${synonymPair.context.replace(
                                new RegExp(synonymPair.original, "gi"),
                                `<span style="color: #2563eb; text-decoration: underline;">${synonymPair.synonym}</span>`
                              )}"`,
                            }}
                          />
                        </div>
                      </div>

                      <p className="text-sm text-[var(--color-foreground)]">
                        {synonymPair.explanation}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-start items-center pt-6">
        <button
          onClick={onNavigateToFeedback}
          className="flex items-center gap-3 px-4 py-3 bg-[var(--color-card)] border-2 border-[var(--color-border)] rounded-lg hover:border-black dark:hover:border-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Feedback
        </button>
      </div>
    </div>
  );
}
