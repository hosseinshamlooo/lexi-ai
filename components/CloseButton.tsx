"use client";

import { X } from "lucide-react";

interface CloseButtonProps {
  onClick: () => void;
  className?: string;
}

export default function CloseButton({
  onClick,
  className = "",
}: CloseButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`p-3 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-700 dark:text-gray-300 ${className}`}
      aria-label="Close"
    >
      <X className="h-6 w-6" strokeWidth={2} />
    </button>
  );
}
