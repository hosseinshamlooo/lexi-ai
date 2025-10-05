import React, { useState } from "react";

interface TranslatedWordProps {
  word: string;
  translation?: string;
}

export const TranslatedWord: React.FC<TranslatedWordProps> = ({
  word,
  translation,
}) => {
  const [show, setShow] = useState(false);

  return (
    <span
      className="relative cursor-help underline decoration-dotted underline-offset-2 mx-[1px]"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {word}
      {translation && show && (
        <div className="absolute left-1/2 -translate-x-1/2 mt-6 w-max p-1 bg-gray-200 text-black text-xs rounded shadow-lg z-10">
          {translation}
        </div>
      )}
    </span>
  );
};
