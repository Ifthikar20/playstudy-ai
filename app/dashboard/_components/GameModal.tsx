"use client";

import { useState, useRef, useEffect } from "react";

interface GameModalProps {
  gameTitle: string;
  onClose: () => void;
}

export default function GameModal({ gameTitle, onClose }: GameModalProps) {
  const [inputText, setInputText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Adjust textarea height dynamically
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      if (isExpanded) {
        textarea.style.height = "100%"; // Full height in expanded mode
      } else {
        textarea.style.height = "auto"; // Reset height
        textarea.style.height = `${Math.min(textarea.scrollHeight, 400)}px`; // Cap at 400px in default mode
      }
    }
  }, [inputText, isExpanded]);

  // Enhanced beautify function for paragraph arrangement
  const handleBeautify = () => {
    try {
      // Split into paragraphs based on double newlines or single newlines
      const paragraphs = inputText
        .split(/\n\s*\n|\n/)
        .map(p => p.trim())
        .filter(p => p.length > 0);

      // Format paragraphs with proper spacing and indentation
      const formattedText = paragraphs
        .map((para) => {
          // Detect lists or keep as paragraph
          if (para.match(/^-|\*|\d+\./)) {
            const lines = para.split("\n").map(line => line.trim());
            return lines
              .map(line => {
                if (line.startsWith("-") || line.startsWith("*")) {
                  return `  • ${line.slice(1).trim()}`; // Indented bullet
                }
                return `  ${line}`; // Indented line
              })
              .join("\n");
          }
          return `${para}`; // Plain paragraph
        })
        .join("\n\n"); // Consistent double newline between paragraphs

      setInputText(formattedText);
    } catch (error) {
      console.error("Error beautifying text:", error);
      alert("Failed to beautify text. Please check your input.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/convert-to-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: inputText, game: gameTitle }),
      });

      if (!response.ok) throw new Error("Failed to process input");

      const quizData = await response.json();

      if (gameTitle === "Hangman") {
        window.dispatchEvent(new CustomEvent("launchHangman", { detail: quizData }));
        onClose();
      }
    } catch (error) {
      console.error("Error submitting input:", error);
      alert("Failed to process input. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4">
      <div 
        className={`bg-gray-900 p-6 rounded-xl shadow-2xl flex flex-col transition-all duration-500 ease-in-out ${
          isExpanded 
            ? "w-full max-w-5xl h-[90vh]" 
            : "w-full max-w-md h-auto max-h-[70vh]"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
            {gameTitle}
          </h2>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-4 py-1 bg-purple-700 text-white rounded-full hover:bg-purple-800 transition-all duration-300 transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            {isExpanded ? "Collapse" : "Expand"}
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter your notes here..."
            className="w-full flex-grow p-3 bg-gray-800 text-white rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 resize-none overflow-y-auto placeholder-gray-500"
            disabled={isSubmitting}
          />
          <div className="flex justify-between gap-3 mt-4">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleBeautify}
                className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-all duration-300 transform hover:scale-110 hover:rotate-2 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting || !inputText}
              >
                <span className="relative">
                  Beautify
                  <span className="absolute -top-1 -right-4 text-xs text-purple-200 animate-pulse">✨</span>
                </span>
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 transition-all duration-300 transform hover:scale-110 hover:-rotate-2 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
            <button
              type="submit"
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isSubmitting || !inputText}
            >
              {isSubmitting ? "Processing..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}