"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface GameModalProps {
  gameTitle: string;
  onClose: () => void;
}

export default function GameModal({ gameTitle, onClose }: GameModalProps) {
  const [inputText, setInputText] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  // You can add functionality to this later
  const handleSubmit = () => {
    // We'll implement this when you tell me what it should do
    console.log("Submit clicked, current text:", inputText);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">{gameTitle} Input</h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-300"
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <textarea
          value={inputText}
          onChange={handleInputChange}
          placeholder={`Enter text for ${gameTitle}...`}
          className="w-full h-80 p-4 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
        />
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
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-[0_0_10px_#9f7aea] hover:shadow-[0_0_15px_#9f7aea]"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}