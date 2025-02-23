"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface GameModalProps {
  gameTitle: string;
  onClose: () => void;
}

export default function GameModal({ gameTitle, onClose }: GameModalProps) {
  const [inputText, setInputText] = useState("");
  const [aiOutput, setAiOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async () => {
    if (!inputText.trim()) {
      setError("Please enter some text");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-game", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ gameTitle, inputText }),
      });

      const data = await response.json();
      console.log("API Response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate game");
      }

      setAiOutput(data.aiResponse);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      console.error("Error fetching game content:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">{gameTitle} Input</h2>
          <button onClick={onClose} className="text-white hover:text-gray-300">
            <X className="h-6 w-6" />
          </button>
        </div>
        <textarea
          value={inputText}
          onChange={handleInputChange}
          placeholder={`Enter text for ${gameTitle}...`}
          className="w-full h-40 p-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
        />
        {aiOutput && (
          <div className="mt-4 p-4 bg-gray-700 rounded-lg">
            <h3 className="text-lg font-semibold text-white">Generated Game:</h3>
            <p className="text-gray-300">{aiOutput}</p>
          </div>
        )}
        {error && (
          <div className="mt-4 p-4 bg-red-500/20 rounded-lg text-red-300">{error}</div>
        )}
        <p className="text-gray-300 text-sm mt-2">
          Current input: {inputText.length} characters
        </p>
        <div className="mt-4 flex justify-end gap-4">
          <button
            onClick={onClose}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            Close
          </button>
          <button
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-[0_0_10px_#9f7aea] hover:shadow-[0_0_15px_#9f7aea] disabled:opacity-50"
            disabled={loading}
          >
            {loading ? "Generating..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}