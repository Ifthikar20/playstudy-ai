"use client";

import { useState, useEffect } from "react";


interface QuizQuestion {
  question: string;
  answers: string[];
  correct_answer: string;
  difficulty: string;
}

interface HangmanProps {
  quizData: QuizQuestion[];
  onClose: () => void;
}

export default function Hangman({ quizData, onClose }: HangmanProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [guesses, setGuesses] = useState<string[]>([]);
  const [attempts, setAttempts] = useState(6);
  const [wrongHints, setWrongHints] = useState<string[]>([]);
  const [showNumbers, setShowNumbers] = useState(false);

  const currentQuestion = quizData[currentIndex];
  // Modified to better handle potential numeric answers
  const fullAnswer = currentQuestion.correct_answer.split(". ")[1].toLowerCase();
  const answerWords = fullAnswer.split(" ");
  const fillerWords = ["of", "and", "the", "in", "to", "a", "an"];
  const contentWords = answerWords.filter((word) => !fillerWords.includes(word));
  
  // Choose the last significant word or a word with numbers if available
  const wordWithNumbers = contentWords.find(word => /\d/.test(word));
  const wordToGuess = wordWithNumbers || contentWords[contentWords.length - 1];
  const hint = fullAnswer.slice(0, fullAnswer.lastIndexOf(wordToGuess)).trim() + " ";

  // Update to handle numbers in the word to guess
  const displayWord = wordToGuess
    .split("")
    .map((char) => (guesses.includes(char) || char === " " ? char : "_"))
    .join(" ");

  // Generate a wrong hint based on incorrect guesses
  const generateWrongHint = (character: string) => {
    if (!wordToGuess.includes(character)) {
      // Check if it's a number
      if (!isNaN(parseInt(character))) {
        setWrongHints(prev => [...prev, `The word doesn't contain the number ${character}`]);
        return;
      }
      
      // For letters, provide more detailed hints
      const wrongWords = {
        'a': wordToGuess === 'boks' ? 'bakes' : 'apples',
        'e': wordToGuess === 'boks' ? 'beaks' : 'eagles',
        'p': wordToGuess === 'boks' ? 'pokes' : 'pears',
        // Add more mappings as needed for different words
      };
      const newHint = wrongWords[character as keyof typeof wrongWords] || 'something else';
      setWrongHints(prev => [...prev, `Not ${newHint}`]);
    }
  };

  const handleGuess = (character: string) => {
    if (!guesses.includes(character)) {
      setGuesses([...guesses, character]);
      if (!wordToGuess.includes(character)) {
        setAttempts(attempts - 1);
        generateWrongHint(character);
      }
    }
  };
  
  const toggleNumbers = () => {
    setShowNumbers(!showNumbers);
  };

  const isGameOver = attempts === 0 || displayWord.replace(/\s/g, "") === wordToGuess;

  useEffect(() => {
    if (isGameOver) {
      const timer = setTimeout(() => {
        if (currentIndex < quizData.length - 1) {
          setCurrentIndex(currentIndex + 1);
          setGuesses([]);
          setAttempts(6);
          setWrongHints([]);
        } else {
          onClose();
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isGameOver, currentIndex, quizData.length, onClose]);

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="relative bg-gray-900 p-6 rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-purple-900/40 to-transparent rounded-t-full opacity-50" />
          <div className="absolute top-10 left-10 right-10 h-48 bg-purple-800/30 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-blue-800/20 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        {/* Main content */}
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
              Hangman Challenge
            </h2>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
            >
              Exit Game
            </button>
          </div>

          <div className="bg-gradient-to-r from-purple-600/30 to-blue-600/30 p-4 rounded-lg mb-6 shadow-lg">
            <div className="flex justify-between items-center mb-2">
              <span className="text-purple-300">Round {currentIndex + 1} of {quizData.length}</span>
              <span className="text-green-300">
                Attempts: <span className="text-yellow-300">{attempts}</span>
              </span>
            </div>
            <p className="text-xl md:text-2xl font-bold text-white mb-2">
              {currentQuestion.question}
            </p>
          </div>

          <div className="text-4xl font-mono mb-4 bg-gray-800/80 p-6 rounded-lg text-center border border-purple-500/30 shadow-lg">
            <span className="text-gray-300">{hint}</span>
            <span className="font-bold text-purple-400">{displayWord}</span>
          </div>
          
          {/* Wrong Hints Display */}
          {wrongHints.length > 0 && (
            <div className="mb-4 p-3 bg-gray-800/60 rounded-lg text-sm text-gray-300 italic">
              {wrongHints.slice(-2).map((hint, index) => (
                <p key={index}>{hint}</p>
              ))}
            </div>
          )}
          
          {isGameOver && (
            <div className="mt-6 p-4 bg-gradient-to-r from-purple-900/50 to-blue-900/50 rounded-lg text-center border border-purple-500/30 shadow-lg">
              <p className={`text-2xl font-bold ${attempts === 0 
                ? "text-red-400" 
                : "text-green-400"}`}>
                {attempts === 0 ? "Challenge Failed" : "Challenge Completed"}
              </p>
              <p className="mt-2 text-lg text-gray-300">
                Solution: <span className="font-bold text-purple-300">{fullAnswer}</span>
              </p>
              <p className="mt-2 text-sm text-gray-400">
                {currentIndex < quizData.length - 1
                  ? "Next challenge in 2 seconds..."
                  : "All Challenges Completed"}
              </p>
            </div>
          )}
          
          {/* Toggle Numbers Button */}
          <div className="flex justify-center mb-4">
            <button
              onClick={toggleNumbers}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-lg"
            >
              {showNumbers ? "Hide Numbers" : "Show Numbers"}
            </button>
          </div>

          {/* Letters Keyboard */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {"abcdefghijklmnopqrstuvwxyz".split("").map((letter) => (
              <button
                key={letter}
                onClick={() => handleGuess(letter)}
                disabled={guesses.includes(letter) || isGameOver}
                className={`p-3 rounded text-white font-semibold text-lg transition-all transform hover:scale-105
                  ${guesses.includes(letter) 
                    ? "bg-gray-700 cursor-not-allowed opacity-50" 
                    : wordToGuess.includes(letter) && guesses.includes(letter)
                      ? "bg-green-600"
                      : guesses.includes(letter)
                        ? "bg-red-600"
                        : "bg-purple-600 hover:bg-purple-500 hover:shadow-lg hover:shadow-purple-500/20"}`}
              >
                {letter.toUpperCase()}
              </button>
            ))}
          </div>
          
          {/* Numbers Keyboard (conditionally rendered) */}
          {showNumbers && (
            <div className="grid grid-cols-5 gap-2 mt-4">
              {"1234567890".split("").map((number) => (
                <button
                  key={number}
                  onClick={() => handleGuess(number)}
                  disabled={guesses.includes(number) || isGameOver}
                  className={`p-3 rounded text-white font-semibold text-lg transition-all transform hover:scale-105
                    ${guesses.includes(number) 
                      ? "bg-gray-700 cursor-not-allowed opacity-50" 
                      : wordToGuess.includes(number) && guesses.includes(number)
                        ? "bg-green-600"
                        : guesses.includes(number)
                          ? "bg-red-600"
                          : "bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20"}`}
                >
                  {number}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}