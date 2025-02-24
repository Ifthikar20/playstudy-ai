"use client";

import { useState, useRef, useEffect } from "react";

interface GameModalProps {
  gameTitle: string;
  onClose: () => void;
}

export default function GameModal({ gameTitle, onClose }: GameModalProps) {
  const [inputText, setInputText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Adjust textarea height dynamically
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto"; // Reset height to recalculate
      textarea.style.height = `${Math.min(textarea.scrollHeight, 400)}px`; // Cap at 400px
    }
  }, [inputText]);

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-6 rounded-lg w-full max-w-lg flex flex-col">
        <h2 className="text-xl font-bold text-white mb-4">{gameTitle}</h2>
        <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Enter your paragraph here..."
            className="w-full min-h-[128px] max-h-[400px] p-2 bg-gray-700 text-white rounded mb-4 resize-none overflow-y-auto focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
          <div className="flex justify-end gap-2 mt-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}