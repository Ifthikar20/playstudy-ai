"use client";

import { useState, useEffect } from "react";
import { Brain } from 'lucide-react';

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

  const currentQuestion = quizData[currentIndex];
  const fullAnswer = currentQuestion.correct_answer.split(". ")[1].toLowerCase();
  const answerWords = fullAnswer.split(" ");
  const fillerWords = ["of", "and", "the", "in", "to", "a", "an"];
  const contentWords = answerWords.filter((word) => !fillerWords.includes(word));
  const wordToGuess = contentWords[contentWords.length - 1];
  const hint = fullAnswer.slice(0, fullAnswer.lastIndexOf(wordToGuess)).trim() + " ";

  const displayWord = wordToGuess
    .split("")
    .map((char) => (guesses.includes(char) || char === " " ? char : "_"))
    .join(" ");

  // Generate a wrong hint based on incorrect guesses
  const generateWrongHint = (letter: string) => {
    if (!wordToGuess.includes(letter)) {
      // Simple example: if guessing 'boks' and user picks 'a', hint could be "not bakes"
      const wrongWords = {
        'a': wordToGuess === 'boks' ? 'bakes' : 'apples',
        'e': wordToGuess === 'boks' ? 'beaks' : 'eagles',
        'p': wordToGuess === 'boks' ? 'pokes' : 'pears',
        // Add more mappings as needed for different words
      };
      const newHint = wrongWords[letter as keyof typeof wrongWords] || 'something else';
      setWrongHints(prev => [...prev, `Not ${newHint}`]);
    }
  };

  const handleGuess = (letter: string) => {
    if (!guesses.includes(letter)) {
      setGuesses([...guesses, letter]);
      if (!wordToGuess.includes(letter)) {
        setAttempts(attempts - 1);
        generateWrongHint(letter);
      }
    }
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
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-gray-800 to-purple-900 opacity-90" />
      
      <div className="relative bg-gray-800 p-8 rounded-lg w-full max-w-lg text-white shadow-2xl border border-purple-600 transform transition-all hover:shadow-purple-700/50">
        <Brain className="absolute top-4 left-4 h-6 w-6 text-purple-400 opacity-50" />
        
        <h2 className="text-3xl font-bold mb-6 text-center text-purple-300">
          Hangman Challenge
        </h2>
        
        <p className="mb-4 font-medium text-lg text-gray-200">
          {currentQuestion.question}
          <span className="text-sm text-purple-400 ml-2">
            (Round {currentIndex + 1}/{quizData.length})
          </span>
        </p>
        
        <div className="text-4xl font-mono mb-4 bg-gray-700 p-4 rounded text-center border border-purple-500/30">
          <span className="text-gray-300">{hint}</span>
          <span className="font-bold text-purple-400">{displayWord}</span>
        </div>
        
        {/* Wrong Hints Display */}
        {wrongHints.length > 0 && (
          <div className="mb-4 text-sm text-gray-400 italic">
            {wrongHints.slice(-2).map((hint, index) => (
              <p key={index}>{hint}</p>
            ))}
          </div>
        )}
        
        <p className="text-xl text-gray-300 mb-6">
          Attempts Remaining: 
          <span className="font-bold text-purple-400 ml-2">{attempts}</span>
        </p>
        
        {isGameOver && (
          <div className="mt-6 p-4 bg-gray-700 rounded text-center border border-purple-500/30">
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
        
        <div className="grid grid-cols-7 gap-2 mt-6">
          {"abcdefghijklmnopqrstuvwxyz".split("").map((letter) => (
            <button
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={guesses.includes(letter) || isGameOver}
              className={`p-3 bg-purple-600 rounded text-white font-semibold text-lg transition-all
                ${guesses.includes(letter) 
                  ? "bg-gray-900 cursor-not-allowed opacity-50" 
                  : "hover:bg-purple-500 hover:shadow-purple-600/40"}`}
            >
              {letter.toUpperCase()}
            </button>
          ))}
        </div>
        
        <button
          onClick={onClose}
          className="mt-8 px-6 py-2 bg-purple-700 rounded text-white font-semibold w-full transition-all hover:bg-purple-600 hover:shadow-purple-700/40"
        >
          Exit Challenge
        </button>
      </div>
    </div>
  );
}