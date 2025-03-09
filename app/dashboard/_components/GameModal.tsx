"use client"; // Directive at the top

import React, { 
  useState, 
  useRef, 
  useEffect, 
  useCallback, 
  useMemo 
} from "react";

// Custom Debounce Utility with proper typing
function debounce<F extends (...args: string[]) => void>(
  func: F, 
  delay: number
): (...args: Parameters<F>) => void {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<F>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Constants for better maintainability
const MAX_INPUT_LENGTH = 50000;
const MAX_TEXTAREA_HEIGHT = 800;
const DISPATCH_EVENTS = {
  "Hangman": "launchHangman",
  "Millionaire": "launchMillionaire",
  "Quick Quiz": "launchQuickQuiz",
  "Memory Match": "launchMemoryMatch",
  "CrossWord": "launchCrossWord"
} as const;

interface GameModalProps {
  gameTitle: string;
  onClose: () => void;
  onSaveToNote?: (content: string) => void;
  initialContent?: string;
  hideNoteButton?: boolean;
}

export default function GameModal({ 
  gameTitle, 
  onClose, 
  onSaveToNote, 
  initialContent = "",
  hideNoteButton = false
}: GameModalProps) {
  const [inputText, setInputText] = useState(initialContent);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Effect for textarea height adjustment (inlined adjustTextareaHeight)
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = isExpanded 
      ? "100%" 
      : `${Math.min(textarea.scrollHeight, MAX_TEXTAREA_HEIGHT)}px`;
  }, [inputText, isExpanded]); // Dependencies: inputText, isExpanded

  // Debounced input text change handler
  const debouncedSetInputText = useCallback(
    (text: string) => {
      const debouncedFn = debounce((value: string) => {
        setInputText(value);
      }, 300);
      debouncedFn(text);
    },
    []
  );

  // Optimized beautification logic
  const handleBeautify = useCallback(() => {
    if (!inputText) return;

    try {
      const beautifiedText = transformText(inputText);
      setInputText(beautifiedText);
    } catch (error) {
      console.error("Beautification error:", error);
      alert("Text beautification failed.");
    }
  }, [inputText]);

  // Debounced submit to prevent rapid multiple submissions
  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    if (inputText.length > MAX_INPUT_LENGTH) {
      alert(`Input too large. Maximum ${MAX_INPUT_LENGTH} characters allowed.`);
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/convert-to-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: inputText, game: gameTitle }),
      });

      if (!response.ok) throw new Error("Failed to process input");

      const quizData = await response.json();
      const eventName = DISPATCH_EVENTS[gameTitle as keyof typeof DISPATCH_EVENTS];

      if (eventName) {
        window.dispatchEvent(new CustomEvent(eventName, { detail: quizData }));
        onClose();
      }
    } catch (error) {
      console.error("Submission error:", error);
      alert("Failed to process input. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }, [inputText, gameTitle, onClose]);

  // Memoized note saving handler
  const handleSaveToNote = useCallback(() => {
    const trimmedText = inputText.trim();
    if (trimmedText && onSaveToNote) {
      onSaveToNote(trimmedText);
      onClose();
    } else if (trimmedText) {
      alert("Note saving is not implemented.");
      onClose();
    }
  }, [inputText, onSaveToNote, onClose]);

  // Performance optimization: Memoized render
  const renderContent = useMemo(() => ({
    expandButton: (
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-4 py-1 bg-indigo-700 text-white rounded-full hover:bg-indigo-600"
      >
        {isExpanded ? "Collapse" : "Expand"}
      </button>
    )
  }), [isExpanded]);

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div 
        className={`bg-gray-900 p-6 rounded-xl shadow-2xl flex flex-col transition-all duration-500 ease-in-out border-2 border-purple-500 ${
          isExpanded 
            ? "w-[95vw] h-[90vh] max-w-full" 
            : "w-full max-w-3xl h-auto max-h-[80vh]"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-extrabold text-white bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent font-mono tracking-tight">
            {gameTitle}
          </h2>
          {renderContent.expandButton}
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-grow">
          <textarea
            ref={textareaRef}
            value={inputText}
            onChange={(e) => debouncedSetInputText(e.target.value)}
            placeholder="Drop your notes here... 📚✨"
            className="w-full flex-grow p-4 bg-gray-800 text-white rounded-lg border-2 border-gray-700"
            disabled={isSubmitting}
            maxLength={MAX_INPUT_LENGTH}
          />
          
          <div className="flex justify-between gap-3 mt-4">
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleBeautify}
                disabled={isSubmitting || !inputText}
                className="btn-primary"
              >
                ✨ Beautify
              </button>
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="btn-secondary"
              >
                Bail Out ✌️
              </button>
            </div>
            
            <div className="flex gap-3">
              {!hideNoteButton && (
                <button
                  type="button"
                  onClick={handleSaveToNote}
                  disabled={isSubmitting || !inputText}
                  className="btn-success"
                >
                  📓 Save Note
                </button>
              )}
              
              <button
                type="submit"
                disabled={isSubmitting || !inputText}
                className="btn-submit"
              >
                {isSubmitting ? "Loading..." : "Let's Go! 🚀"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// Pure function for text transformation
function transformText(text: string): string {
  const paragraphs = text
    .split(/\n\s*\n|\n/)
    .map(p => p?.trim() || "")
    .filter(p => p.length > 0);

  const bulletColors = ["🔴", "🟠", "🟡", "🟢", "🔵", "🟣"];
  let bulletColorIndex = 0;

  return paragraphs
    .map((para, index) => {
      const headerMatch = para.match(/^(#+)\s/);
      if (headerMatch) {
        const headerLevel = headerMatch[1].length;
        const headerText = para.replace(/^#+\s/, '');
        return headerLevel === 1 
          ? `# 📝 ${headerText.toUpperCase()} 📝`
          : `${'#'.repeat(headerLevel)} ${headerText}`;
      }

      if (para.match(/^[-*]\d+\./)) {
        return para
          .split("\n")
          .map(line => {
            if (line.startsWith("-") || line.startsWith("*")) {
              const bullet = bulletColors[bulletColorIndex];
              bulletColorIndex = (bulletColorIndex + 1) % bulletColors.length;
              return `  ${bullet} ${line.slice(1).trim()}`;
            }
            return `  ${line}`;
          })
          .join("\n");
      }

      return index === 0 && !para.match(/^#+\s/) 
        ? `✍️ ${para}` 
        : para;
    })
    .join("\n\n");
}