// /Users/ifthikaraliseyed/Desktop/AI_PLAY_STUDY/playstudy-ai/app/dashboard/_components/Games/HangmanGame.tsx
"use client";

import { useState, useEffect } from "react";
import GameLayout from "./GameLayout";

interface QuizQuestion {
  question: string;
  answers: string[];
  correct_answer: string;
  difficulty: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    question: "What is the primary source of energy for Earth's climate system?",
    answers: [
      "A. The Moon's gravitational pull",
      "B. The Sun's radiation",
      "C. Earth's core heat",
      "D. Human industrial activity",
    ],
    correct_answer: "B. The Sun's radiation",
    difficulty: "Medium",
  },
  {
    question: "Which planet is known as the Red Planet?",
    answers: [
      "A. Jupiter",
      "B. Venus",
      "C. Mars",
      "D. Mercury",
    ],
    correct_answer: "C. Mars",
    difficulty: "Easy",
  },
  {
    question: "What gas do plants primarily use for photosynthesis?",
    answers: [
      "A. Oxygen",
      "B. Nitrogen",
      "C. Carbon dioxide",
      "D. Hydrogen",
    ],
    correct_answer: "C. Carbon dioxide",
    difficulty: "Medium",
  },
  {
    question: "Who wrote the play 'Romeo and Juliet'?",
    answers: [
      "A. Charles Dickens",
      "B. William Shakespeare",
      "C. Jane Austen",
      "D. Mark Twain",
    ],
    correct_answer: "B. William Shakespeare",
    difficulty: "Medium",
  },
  {
    question: "What is the largest organ in the human body?",
    answers: [
      "A. Liver",
      "B. Brain",
      "C. Skin",
      "D. Heart",
    ],
    correct_answer: "C. Skin",
    difficulty: "Easy",
  },
];

// Colorful and animated hangman stages
const hangmanStages: string[] = [
  `
    <span class="text-purple-500">+---+</span>
    <span class="text-gray-400">    |</span>
    <span class="text-gray-400">    |</span>
    <span class="text-gray-400">    |</span>
    <span class="text-gray-400">    |</span>
    <span class="text-gray-400">    |</span>
    <span class="text-purple-500">=========</span>
  `,
  `
    <span class="text-purple-500">+---+</span>
    <span class="text-pink-500 animate-bounce">O</span><span class="text-gray-400">   |</span>
    <span class="text-gray-400">    |</span>
    <span class="text-gray-400">    |</span>
    <span class="text-gray-400">    |</span>
    <span class="text-gray-400">    |</span>
    <span class="text-purple-500">=========</span>
  `,
  `
    <span class="text-purple-500">+---+</span>
    <span class="text-pink-500 animate-bounce">O</span><span class="text-gray-400">   |</span>
    <span class="text-yellow-500">|</span><span class="text-gray-400">   |</span>
    <span class="text-gray-400">    |</span>
    <span class="text-gray-400">    |</span>
    <span class="text-gray-400">    |</span>
    <span class="text-purple-500">=========</span>
  `,
  `
    <span class="text-purple-500">+---+</span>
    <span class="text-pink-500 animate-bounce">O</span><span class="text-gray-400">   |</span>
    <span class="text-yellow-500">/</span><span class="text-green-500">|</span><span class="text-gray-400">   |</span>
    <span class="text-gray-400">    |</span>
    <span class="text-gray-400">    |</span>
    <span class="text-gray-400">    |</span>
    <span class="text-purple-500">=========</span>
  `,
  `
    <span class="text-purple-500">+---+</span>
    <span class="text-pink-500 animate-bounce">O</span><span class="text-gray-400">   |</span>
    <span class="text-yellow-500">/</span><span class="text-green-500">|\\</span><span class="text-gray-400">  |</span>
    <span class="text-gray-400">    |</span>
    <span class="text-gray-400">    |</span>
    <span class="text-gray-400">    |</span>
    <span class="text-purple-500">=========</span>
  `,
  `
    <span class="text-purple-500">+---+</span>
    <span class="text-pink-500 animate-bounce">O</span><span class="text-gray-400">   |</span>
    <span class="text-yellow-500">/</span><span class="text-green-500">|\\</span><span class="text-gray-400">  |</span>
    <span class="text-blue-500">/</span><span class="text-gray-400">    |</span>
    <span class="text-gray-400">    |</span>
    <span class="text-gray-400">    |</span>
    <span class="text-purple-500">=========</span>
  `,
  `
    <span class="text-purple-500">+---+</span>
    <span class="text-pink-500 animate-bounce">O</span><span class="text-gray-400">   |</span>
    <span class="text-yellow-500">/</span><span class="text-green-500">|\\</span><span class="text-gray-400">  |</span>
    <span class="text-blue-500">/</span><span class="text-red-500 animate-pulse"> \\</span><span class="text-gray-400">  |</span>
    <span class="text-gray-400">    |</span>
    <span class="text-gray-400">    |</span>
    <span class="text-purple-500">=========</span>
  `,
];

export default function HangmanGame() {
  const [attemptsLeft, setAttemptsLeft] = useState(3);
  const [currentStage, setCurrentStage] = useState(0);
  const [displayWord, setDisplayWord] = useState<string[]>([]);
  const [guess, setGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<QuizQuestion>(
    quizQuestions[Math.floor(Math.random() * quizQuestions.length)]
  );

  const correctAnswer = currentQuiz.correct_answer.split(". ")[1].toLowerCase();

  useEffect(() => {
    setDisplayWord(correctAnswer.replace(/[a-zA-Z']/g, "_").split(""));
  }, [correctAnswer]);

  const handleGuess = () => {
    if (gameOver || !guess) return;

    const lowerGuess = guess.toLowerCase();
    if (lowerGuess.length === 1) {
      const newDisplayWord = [...displayWord];
      let correctGuess = false;

      for (let i = 0; i < correctAnswer.length; i++) {
        if (correctAnswer[i] === lowerGuess) {
          newDisplayWord[i] = lowerGuess;
          correctGuess = true;
        }
      }

      if (!correctGuess) {
        setAttemptsLeft((prev) => prev - 1);
        setCurrentStage((prev) => prev + 1);
      }
      setDisplayWord(newDisplayWord);
    } else {
      if (lowerGuess === correctAnswer) {
        setDisplayWord(correctAnswer.split(""));
      } else {
        setAttemptsLeft((prev) => prev - 1);
        setCurrentStage((prev) => prev + 1);
      }
    }

    setGuess("");
    checkGameStatus();
  };

  const checkGameStatus = () => {
    if (displayWord.join("") === correctAnswer) {
      setGameOver(true);
    } else if (attemptsLeft <= 1) {
      setGameOver(true);
      setDisplayWord(correctAnswer.split(""));
    }
  };

  const resetGame = () => {
    const newQuiz = quizQuestions[Math.floor(Math.random() * quizQuestions.length)];
    setCurrentQuiz(newQuiz);
    setAttemptsLeft(3);
    setCurrentStage(0);
    setDisplayWord(newQuiz.correct_answer.split(". ")[1].toLowerCase().replace(/[a-zA-Z']/g, "_").split(""));
    setGameOver(false);
    setGuess("");
  };

  return (
    <GameLayout title="Hangman Game">
      <p className="text-gray-300 mb-2">{currentQuiz.question}</p>
      <pre
        className="text-gray-400 mb-4 font-mono text-sm sm:text-base leading-tight animate-fade-in"
        dangerouslySetInnerHTML={{ __html: hangmanStages[currentStage] }}
      />
      <p className="text-xl font-mono mb-4 text-yellow-400 animate-pulse-slow">
        {displayWord.join(" ")}
      </p>
      <p className="text-gray-400 mb-2">
        Attempts left: <span className="text-red-500">{attemptsLeft}</span>
      </p>
      <div className="mb-4">
        {currentQuiz.answers.map((answer) => (
          <p key={answer} className="text-gray-400 text-sm hover:text-purple-400 transition-colors">
            {answer}
          </p>
        ))}
      </div>
      {!gameOver ? (
        <div className="flex gap-2">
          <input
            type="text"
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Enter a letter or full answer"
            className="bg-gray-700 text-white rounded-lg px-3 py-2 outline-none border border-purple-500/50 focus:border-purple-500 transition-all"
            disabled={gameOver}
          />
          <button
            onClick={handleGuess}
            className="btn-primary px-4 py-2 text-sm hover:scale-105 transition-transform"
            disabled={gameOver}
          >
            Guess
          </button>
        </div>
      ) : (
        <div>
          <p className={`text-lg mb-4 ${attemptsLeft > 0 ? "text-green-500" : "text-red-500"} animate-bounce`}>
            {attemptsLeft > 0
              ? "Congratulations! You won! 🎉"
              : "Game Over! Better luck next time. 😢"}
          </p>
          <button
            onClick={resetGame}
            className="btn-primary px-4 py-2 text-sm hover:scale-105 transition-transform"
          >
            Play Again
          </button>
        </div>
      )}
    </GameLayout>
  );
}