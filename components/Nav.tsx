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
  { code: "cn", name: "Mandarin", flag: "https://ardslot.com/s/zs.svg" },
];

export const Nav = () => {
  const { theme, setTheme } = useTheme();
  const [currentLang, setCurrentLang] = useState<Language>(languages[0]);
  const [langOpen, setLangOpen] = useState(false);

  return (
    <div className="fixed top-0 right-0 px-4 py-2 flex items-center h-16 z-50">
      <div className="ml-auto flex items-center gap-3">
        {/* Theme toggle button */}
        <Button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          variant="ghost"
          className="flex items-center gap-2 rounded-full px-4 py-3 text-lg"
        >
          <span>
            {theme === "dark" ? (
              <Sun className="size-5" />
            ) : (
              <Moon className="size-5" />
            )}
          </span>
          <span className="-translate-y-[1px]">
            {theme === "dark" ? "Light" : "Dark"} Mode
          </span>
        </Button>

        {/* Language selector */}
        <div className="relative">
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
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 shadow-lg rounded-lg z-10">
              {languages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setCurrentLang(lang);
                    setLangOpen(false);
                  }}
                  className="flex items-center gap-2 w-full px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg text-lg"
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
