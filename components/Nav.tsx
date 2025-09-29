"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

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

interface NavProps {
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
}

export const Nav = ({ selectedLanguage, setSelectedLanguage }: NavProps) => {
  const { theme, setTheme } = useTheme();
  const [langOpen, setLangOpen] = useState(false);

  const currentLang =
    languages.find((l) => l.code === selectedLanguage) || languages[0];

  return (
    <div className="fixed top-0 right-0 left-0 px-4 py-2 flex items-center h-16 z-50 bg-[var(--color-background)]">
      <div className="ml-auto flex items-center gap-3 flex-nowrap relative">
        {/* Theme toggle */}
        <Button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          variant="ghost"
          className="flex items-center gap-2 rounded-full px-4 py-3 text-lg flex-shrink-0"
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
            className="flex items-center gap-2 rounded-full px-4 py-3 text-lg"
          >
            <img
              src={currentLang.flag}
              alt={currentLang.name}
              className="w-6 h-auto object-contain"
            />
            <span className="-translate-y-[1px]">{currentLang.name}</span>
          </Button>

          {langOpen && (
            <div className="absolute right-0 mt-2 min-w-[12rem] bg-white dark:bg-gray-800 shadow-lg rounded-lg z-50">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setSelectedLanguage(lang.code);
                    setLangOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-lg whitespace-nowrap"
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
