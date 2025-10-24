"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Moon, Sun, FileText, ChevronDown } from "lucide-react";
import { useTheme } from "next-themes";
import { ConversationInsights } from "@/utils/insightsStorage";

interface Language {
  code: string;
  name: string;
  flag: string;
}

const languages: Language[] = [
  { code: "en", name: "English", flag: "https://ardslot.com/s/en.svg" },
  { code: "fr", name: "French", flag: "https://ardslot.com/s/fr.svg" },
  { code: "es", name: "Spanish", flag: "https://ardslot.com/s/es.svg" },
  { code: "de", name: "German", flag: "https://ardslot.com/s/de.svg" },
  { code: "zh", name: "Mandarin", flag: "https://ardslot.com/s/zs.svg" },
];

interface ConversationHistory {
  id: string;
  title: string;
  date: string;
  situation: {
    role: string;
    description: string;
    greeting: string;
    prompt: string;
    image?: string;
  };
}

interface NavProps {
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  showFeedback?: boolean;
  conversationHistory?: ConversationHistory[];
  currentConversation?: ConversationHistory;
  onConversationChange?: (conversation: ConversationHistory) => void;
  insightsHistory?: ConversationInsights[];
  onViewInsights?: (insights: ConversationInsights) => void;
  showInsightsInHero?: boolean;
}

export const Nav = ({
  selectedLanguage,
  setSelectedLanguage,
  showFeedback = false,
  conversationHistory = [],
  currentConversation,
  onConversationChange,
  insightsHistory = [],
  onViewInsights,
  showInsightsInHero = false,
}: NavProps) => {
  const { theme, setTheme } = useTheme();
  const [langOpen, setLangOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const historyRef = useRef<HTMLDivElement>(null);

  const currentLang =
    languages.find((l) => l.code === selectedLanguage) || languages[0];

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        historyRef.current &&
        !historyRef.current.contains(event.target as Node)
      ) {
        setHistoryOpen(false);
      }
    }

    if (historyOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [historyOpen]);

  return (
    <div
      className={`fixed top-0 right-0 left-0 px-4 py-2 flex items-center justify-between h-16 z-50 bg-[var(--color-background)] ${
        showFeedback ? "border-b-2 border-[var(--color-background)]" : ""
      }`}
    >
      {/* Left side - Conversation History Dropdown */}
      <div className="flex items-center gap-3 flex-nowrap relative">
        {/* Show insights history in hero section */}
        {showInsightsInHero && insightsHistory.length > 0 && (
          <div className="relative z-50" ref={historyRef}>
            <Button
              onClick={() => setHistoryOpen(!historyOpen)}
              variant="ghost"
              className="flex items-center gap-2 rounded-full px-4 py-3 text-lg flex-shrink-0 hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)] transition-colors"
            >
              <FileText className="size-5" />
              <span className="-translate-y-[1px]">Insights</span>
              <ChevronDown
                className={`size-5 transition-transform ${
                  historyOpen ? "rotate-180" : ""
                }`}
              />
            </Button>

            {/* Insights History Dropdown */}
            {historyOpen && (
              <div className="absolute left-0 mt-2 min-w-[12rem] bg-[var(--color-popover)] border border-[var(--color-border)] shadow-lg rounded-lg z-50 max-h-80 overflow-y-auto">
                {insightsHistory.map((insights) => (
                  <button
                    key={insights.id}
                    onClick={() => {
                      onViewInsights?.(insights);
                      setHistoryOpen(false);
                    }}
                    className="flex items-center gap-2 w-full px-4 py-3 rounded-lg text-lg whitespace-nowrap transition-colors hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)] text-[var(--color-popover-foreground)]"
                  >
                    <FileText className="h-5 w-5 flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">
                        {insights.title}
                      </div>
                      <div className="text-xs text-[var(--color-muted-foreground)]">
                        {insights.date}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Show conversation history in feedback section */}
        {showFeedback &&
          conversationHistory.length > 0 &&
          currentConversation && (
            <div className="relative z-50" ref={historyRef}>
              <Button
                onClick={() => setHistoryOpen(!historyOpen)}
                variant="ghost"
                className="flex items-center gap-2 rounded-full px-4 py-3 text-lg flex-shrink-0 hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)] transition-colors"
              >
                <FileText className="size-5" />
                <span className="-translate-y-[1px] max-w-48 truncate">
                  {currentConversation.title}
                </span>
                <ChevronDown
                  className={`size-5 transition-transform ${
                    historyOpen ? "rotate-180" : ""
                  }`}
                />
              </Button>

              {/* History Dropdown */}
              {historyOpen && (
                <div className="absolute left-0 mt-2 min-w-[12rem] bg-[var(--color-popover)] border border-[var(--color-border)] shadow-lg rounded-lg z-50 max-h-80 overflow-y-auto">
                  {conversationHistory.map((conversation, index) => (
                    <button
                      key={conversation.id}
                      onClick={() => {
                        onConversationChange?.(conversation);
                        setHistoryOpen(false);
                      }}
                      className={`flex items-center gap-2 w-full px-4 py-3 rounded-lg text-lg whitespace-nowrap transition-colors ${
                        currentConversation.id === conversation.id
                          ? "bg-[var(--color-accent)] text-[var(--color-accent-foreground)]"
                          : "hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)] text-[var(--color-popover-foreground)]"
                      }`}
                    >
                      <FileText className="h-5 w-5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium truncate">
                          {conversation.title}
                        </div>
                        <div className="text-xs text-[var(--color-muted-foreground)]">
                          {conversation.date}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
      </div>

      {/* Right side - Theme toggle and Language selector */}
      <div className="flex items-center gap-3 flex-nowrap relative">
        {/* Theme toggle */}
        <Button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          variant="ghost"
          className="flex items-center gap-2 rounded-full px-4 py-3 text-lg flex-shrink-0 hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)] transition-colors"
        >
          {theme === "dark" ? (
            <Sun className="size-5" />
          ) : (
            <Moon className="size-5" />
          )}
          <span className="-translate-y-[1px]">
            {theme === "dark" ? "Light" : "Dark"} Mode
          </span>
        </Button>

        {/* Language selector */}
        <div className="relative flex-shrink-0">
          <Button
            onClick={() => setLangOpen(!langOpen)}
            variant="ghost"
            className={`flex items-center gap-2 rounded-full px-4 py-3 text-lg transition-colors ${
              langOpen
                ? "bg-[var(--color-accent)] text-[var(--color-accent-foreground)]"
                : "hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)]"
            }`}
          >
            <img
              src={currentLang.flag}
              alt={currentLang.name}
              className="w-6 h-auto object-contain"
            />
            <span className="-translate-y-[1px]">{currentLang.name}</span>
          </Button>

          {langOpen && (
            <div className="absolute right-0 mt-2 min-w-[12rem] bg-[var(--color-popover)] border border-[var(--color-border)] shadow-lg rounded-lg z-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSelectedLanguage(lang.code);
                    setLangOpen(false);
                  }}
                  className={`flex items-center gap-2 w-full px-4 py-3 rounded-lg text-lg whitespace-nowrap transition-colors ${
                    selectedLanguage === lang.code
                      ? "bg-[var(--color-accent)] text-[var(--color-accent-foreground)]"
                      : "hover:bg-[var(--color-accent)] hover:text-[var(--color-accent-foreground)] text-[var(--color-popover-foreground)]"
                  }`}
                >
                  <img
                    src={lang.flag}
                    alt={lang.name}
                    className="w-6 h-auto object-contain"
                  />
                  <span className="-translate-y-[2px]">{lang.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
