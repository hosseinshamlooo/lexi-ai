"use client";

import { useState } from "react";
import { Nav } from "@/components/Nav";

export default function LanguageWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [selectedLanguage, setSelectedLanguage] = useState("en");

  return (
    <>
      <Nav
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
      />
      {children}
    </>
  );
}
