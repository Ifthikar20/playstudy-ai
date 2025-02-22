// /Users/ifthikaraliseyed/Desktop/AI_PLAY_STUDY/playstudy-ai/app/dashboard/_components/Games/MillionaireGame.tsx
"use client";

import { useEffect } from "react";
import GameLayout from "./GameLayout";
import { useGameContext } from "@/app/dashboard/_components/GameContext";

interface QuizQuestion {
  question: string;
  answers: string[];
  correct_answer: string;
  difficulty: string;
}

const quizQuestions: QuizQuestion[] = [
  {
    question: "What is the capital of France?",
    answers: ["A. London", "B. Paris", "C. Berlin", "D. Madrid"],
    correct_answer: "B. Paris",
    difficulty: "Easy",
  },
  {
    question: "Which animal is known as the king of the jungle?",
    answers: ["A. Elephant", "B. Tiger", "C. Lion", "D. Bear"],
    correct_answer: "C. Lion",
    difficulty: "Easy",
  },
  {
    question: "How many continents are there on Earth?",
    answers: ["A. 5", "B. 6", "C. 7", "D. 8"],
    correct_answer: "C. 7",
    difficulty: "Easy",
  },
  {
    question: "What is the largest planet in our Solar System?",
    answers: ["A. Earth", "B. Jupiter", "C. Saturn", "D. Mars"],
    correct_answer: "B. Jupiter",
    difficulty: "Medium",
  },
  {
    question: "Who painted the Mona Lisa?",
    answers: [
      "A. Vincent van Gogh",
      "B. Pablo Picasso",
      "C. Leonardo da Vinci",
      "D. Claude Monet",
    ],
    correct_answer: "C. Leonardo da Vinci",
    difficulty: "Medium",
  },
  {
    question: "What is the chemical symbol for gold?",
    answers: ["A. Ag", "B. Au", "C. Fe", "D. Cu"],
    correct_answer: "B. Au",
    difficulty: "Medium",
  },
  {
    question: "In which year did the Titanic sink?",
    answers: ["A. 1905", "B. 1912", "C. 1920", "D. 1931"],
    correct_answer: "B. 1912",
    difficulty: "Medium",
  },
  {
    question: "Which country hosted the 2016 Summer Olympics?",
    answers: ["A. China", "B. Brazil", "C. Japan", "D. Russia"],
    correct_answer: "B. Brazil",
    difficulty: "Hard",
  },
  {
    question: "What is the longest river in the world?",
    answers: ["A. Amazon", "B. Nile", "C. Yangtze", "D. Mississippi"],
    correct_answer: "B. Nile",
    difficulty: "Hard",
  },
  {
    question: "Who discovered penicillin?",
    answers: [
      "A. Alexander Fleming",
      "B. Marie Curie",
      "C. Albert Einstein",
      "D. Thomas Edison",
    ],
    correct_answer: "A. Alexander Fleming",
    difficulty: "Hard",
  },
  {
    question: "What is the smallest country in the world by land area?",
    answers: ["A. Monaco", "B. Vatican City", "C. Liechtenstein", "D. San Marino"],
    correct_answer: "B. Vatican City",
    difficulty: "Hard",
  },
  {
    question: "Which element has the atomic number 1?",
    answers: ["A. Helium", "B. Hydrogen", "C. Oxygen", "D. Nitrogen"],
    correct_answer: "B. Hydrogen",
    difficulty: "Hard",
  },
];

const prizeLadder = [
  "$100",
  "$200",
  "$300",
  "$500",
  "$1,000",
  "$2,000",
  "$5,000",
  "$10,000",
  "$25,000",
  "$50,000",
  "$100,000",
  "$1,000,000",
];

export default function MillionaireGame() {
  const { gameState, setGameState } = useGameContext();
  const { winnings, currentQuestionIndex, gameOver } = gameState;

  const currentQuestion = quizQuestions[currentQuestionIndex];

  useEffect(() => {
    resetGame();
  }, []);

  const handleAnswer = (selectedAnswer: string) => {
    if (gameOver) return;

    if (selectedAnswer === currentQuestion.correct_answer) {
      if (currentQuestionIndex + 1 < quizQuestions.length) {
        setGameState({
          currentQuestionIndex: currentQuestionIndex + 1,
          winnings: prizeLadder[currentQuestionIndex],
        });
      } else {
        setGameState({
          winnings: prizeLadder[quizQuestions.length - 1],
          gameOver: true,
        });
      }
    } else {
      setGameState({
        gameOver: true,
        winnings:
          currentQuestionIndex > 0 ? prizeLadder[currentQuestionIndex - 1] : "$0",
      });
    }
  };

  const resetGame = () => {
    setGameState({
      currentQuestionIndex: 0,
      gameOver: false,
      winnings: "$0",
    });
  };

  return (
    <GameLayout title="Who Wants to Be a Millionaire">
      {!gameOver ? (
        <>
          <p className="text-gray-300 mb-2">{currentQuestion.question}</p>
          <p className="text-yellow-400 mb-4">
            Current Prize: {prizeLadder[currentQuestionIndex]}
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
            {currentQuestion.answers.map((answer) => (
              <button
                key={answer}
                onClick={() => handleAnswer(answer)}
                className="bg-gray-700 text-white rounded-lg px-4 py-2 hover:bg-purple-600 transition-all animate-fade-in"
              >
                {answer}
              </button>
            ))}
          </div>
          <p className="text-gray-400">
            Question {currentQuestionIndex + 1} of {quizQuestions.length}
          </p>
        </>
      ) : (
        <div>
          <p
            className={`text-lg mb-4 ${
              winnings !== "$0" ? "text-green-500" : "text-red-500"
            } animate-bounce`}
          >
            {winnings === "$1,000,000"
              ? "Congratulations! You're a Millionaire! 🎉"
              : winnings !== "$0"
              ? `Game Over! You won ${winnings}! 🏆`
              : "Game Over! No winnings this time. 😢"}
          </p>
          <button
            onClick={resetGame}
            className="btn-primary px-4 py-2 text-sm hover:scale-105 transition-transform"
          >
            Play Again
          </button>
        </div>
      )}
      {/* Prize Ladder */}
      <div className="mt-4">
        <p className="text-gray-300 mb-2">Prize Ladder:</p>
        <ul className="text-sm text-gray-400">
          {prizeLadder.map((prize, index) => (
            <li
              key={prize}
              className={`${
                index === currentQuestionIndex && !gameOver
                  ? "text-yellow-400 font-bold"
                  : index < currentQuestionIndex
                  ? "text-green-500"
                  : ""
              }`}
            >
              {index + 1}. {prize}
            </li>
          ))}
        </ul>
      </div>
    </GameLayout>
  );
}