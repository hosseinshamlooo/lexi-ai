"use client";

import { Download, Flag, Trash2 } from "lucide-react";

interface DropdownMenuProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

export default function DropdownMenu({
  isOpen,
  onClose,
  className = "",
}: DropdownMenuProps) {
  if (!isOpen) return null;

  return (
    <div
      className={`absolute right-0 top-full mt-2 w-56 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 ${className}`}
    >
      <div className="py-2">
        <button
          onClick={onClose}
          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <Download className="h-5 w-5" />
          <span>Download audio</span>
        </button>
        <button
          onClick={onClose}
          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100"
        >
          <Flag className="h-5 w-5" />
          <span>Report issue</span>
        </button>
        <button
          onClick={onClose}
          className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 text-red-600 dark:text-red-400"
        >
          <Trash2 className="h-5 w-5" />
          <span>Delete data</span>
        </button>
      </div>
    </div>
  );
}
