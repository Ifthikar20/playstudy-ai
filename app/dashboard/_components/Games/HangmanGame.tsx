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

  const handleGuess = (letter: string) => {
    if (!guesses.includes(letter)) {
      setGuesses([...guesses, letter]);
      if (!wordToGuess.includes(letter)) setAttempts(attempts - 1);
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
        } else {
          onClose();
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isGameOver, currentIndex, quizData.length, onClose]);

  return (
    <div className="fixed inset-0 bg-gray-900 flex items-center justify-center animate-bg">
      <div className="bg-gray-800 p-8 rounded-xl w-full max-w-lg text-white shadow-lg border-4 border-teal-400 transform transition-all hover:scale-105">
        <h2 className="text-3xl font-extrabold mb-4 text-center text-teal-300 drop-shadow-md">
          Guess the Word!
        </h2>
        <p className="mb-2 font-semibold text-lg text-gray-200">
          {currentQuestion.question} 
          <span className="text-sm text-gray-400"> (Round {currentIndex + 1} of {quizData.length})</span>
        </p>
        <p className="text-4xl font-mono mb-6 bg-gray-700 p-4 rounded-lg text-center text-blue-400">
          {hint}
          <span className="font-bold text-orange-500">{displayWord}</span>
        </p>
        <p className="text-xl text-gray-300">Attempts Left: <span className="font-bold text-lime-500">{attempts}</span></p>
        {isGameOver && (
          <div className="mt-6 p-4 bg-gray-600 rounded-lg text-center">
            <p className={`text-2xl font-bold ${attempts === 0 ? "text-red-500" : "text-lime-500"}`}>
              {attempts === 0 ? "Time’s Up!" : "Winner!"}
            </p>
            <p className="mt-2 text-lg">
              The answer was: <span className="font-bold text-blue-400">{fullAnswer}</span>
            </p>
            <p className="mt-2 text-sm text-gray-400">
              {currentIndex < quizData.length - 1
                ? "Next round starting soon..."
                : "Game Show Over!"}
            </p>
          </div>
        )}
        <div className="grid grid-cols-7 gap-3 mt-6">
          {"abcdefghijklmnopqrstuvwxyz".split("").map((letter) => (
            <button
              key={letter}
              onClick={() => handleGuess(letter)}
              disabled={guesses.includes(letter) || isGameOver}
              className="p-3 bg-teal-600 rounded-full text-white font-bold text-lg disabled:bg-gray-500 disabled:cursor-not-allowed hover:bg-teal-700 transition-colors"
            >
              {letter.toUpperCase()}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-6 px-6 py-2 bg-red-600 rounded-full text-white font-semibold hover:bg-red-800 transition-colors w-full"
        >
          Exit Show
        </button>
      </div>
    </div>
  );
}