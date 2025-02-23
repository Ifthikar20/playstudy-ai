"use client";

import { useEffect, useState, useCallback } from "react";
import GameLayout from "./GameLayout";
import { useGameContext } from "@/app/dashboard/_components/GameContext";
import { Phone, Users, HelpCircle } from "lucide-react";

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

const xpLadder = [
  10, 20, 30, 50, 100, 150, 200, 300, 400, 500, 750, 1000,
];

export default function MillionaireGame() {
  const { gameState, setGameState } = useGameContext();
  const { currentQuestionIndex, gameOver } = gameState;
  const [xp, setXp] = useState(0);
  const [lifelines, setLifelines] = useState({
    fiftyFifty: true,
    phoneAFriend: true,
    askTheAudience: true,
  });
  const [currentAnswers, setCurrentAnswers] = useState<string[]>([]);
  const currentQuestion = quizQuestions[currentQuestionIndex];

  const resetGame = useCallback(() => {
    setGameState({
      currentQuestionIndex: 0,
      gameOver: false,
    });
    setXp(0);
    setLifelines({
      fiftyFifty: true,
      phoneAFriend: true,
      askTheAudience: true,
    });
    setCurrentAnswers([...quizQuestions[0].answers]);
  }, [setGameState]);

  useEffect(() => {
    resetGame();
  }, [resetGame]);

  useEffect(() => {
    setCurrentAnswers([...currentQuestion.answers]);
  }, [currentQuestion.answers, currentQuestionIndex]);

  const handleAnswer = (selectedAnswer: string) => {
    if (gameOver) return;

    if (selectedAnswer === currentQuestion.correct_answer) {
      const newXp = xp + xpLadder[currentQuestionIndex];
      setXp(newXp);
      if (currentQuestionIndex + 1 < quizQuestions.length) {
        setGameState({
          currentQuestionIndex: currentQuestionIndex + 1,
        });
      } else {
        setGameState({
          gameOver: true,
        });
      }
    } else {
      setGameState({
        gameOver: true,
      });
    }
  };

  const useFiftyFifty = () => {
    if (!lifelines.fiftyFifty || gameOver) return;
    const correctAnswer = currentQuestion.correct_answer;
    const incorrectAnswers = currentQuestion.answers.filter(
      (ans) => ans !== correctAnswer
    );
    const randomIncorrect = incorrectAnswers.sort(() => 0.5 - Math.random()).slice(0, 2);
    setCurrentAnswers([correctAnswer, ...randomIncorrect].sort(() => 0.5 - Math.random()));
    setLifelines((prev) => ({ ...prev, fiftyFifty: false }));
  };

  const usePhoneAFriend = () => {
    if (!lifelines.phoneAFriend || gameOver) return;
    alert(`Your friend suggests: "${currentQuestion.correct_answer}" (75% confidence)`);
    setLifelines((prev) => ({ ...prev, phoneAFriend: false }));
  };

  const useAskTheAudience = () => {
    if (!lifelines.askTheAudience || gameOver) return;
    const audienceVotes = {
      [currentQuestion.correct_answer]: 70,
      ...currentQuestion.answers.reduce((acc, ans) => {
        if (ans !== currentQuestion.correct_answer) {
          acc[ans] = Math.floor(Math.random() * 10) + 5;
        }
        return acc;
      }, {} as Record<string, number>),
    };
    const total = Object.values(audienceVotes).reduce((sum, vote) => sum + vote, 0);
    const percentages = Object.entries(audienceVotes).map(([ans, votes]) => `${ans}: ${(votes / total * 100).toFixed(0)}%`);
    alert(`Audience votes:\n${percentages.join("\n")}`);
    setLifelines((prev) => ({ ...prev, askTheAudience: false }));
  };

  return (
    <GameLayout title="Millionaire Trivia Challenge">
      <div className="relative bg-gray-900 p-6 rounded-lg shadow-2xl overflow-hidden">
        {/* Background Seating Shape */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-blue-900/70 to-transparent rounded-t-full opacity-80" />
          <div className="absolute top-10 left-10 right-10 h-48 bg-blue-800/50 rounded-full blur-2xl animate-pulse" />
          <div className="absolute top-20 left-20 right-20 h-32 bg-purple-800/40 rounded-full blur-xl animate-pulse delay-75" />
          {/* Glowing lights */}
          <div className="absolute top-5 left-1/4 w-4 h-4 bg-yellow-400 rounded-full blur-sm animate-flicker" />
          <div className="absolute top-10 right-1/4 w-4 h-4 bg-yellow-400 rounded-full blur-sm animate-flicker delay-100" />
          <div className="absolute top-15 left-1/3 w-3 h-3 bg-blue-400 rounded-full blur-sm animate-flicker delay-200" />
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          {!gameOver ? (
            <>
              <div className="bg-gradient-to-r from-purple-600/50 to-blue-600/50 p-4 rounded-lg mb-4 shadow-lg">
                <p className="text-2xl font-extrabold text-white mb-2 animate-fade-in drop-shadow-md">
                  {currentQuestion.question}
                </p>
                <p className="text-green-300 mb-2">
                  XP Gain: <span className="text-yellow-300">{xpLadder[currentQuestionIndex]}</span>
                </p>
                <p className="text-green-300">
                  Total XP: <span className="text-yellow-300">{xp}</span>
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {currentAnswers.map((answer) => (
                  <button
                    key={answer}
                    onClick={() => handleAnswer(answer)}
                    className="bg-gray-800 border-2 border-purple-500/50 text-white rounded-xl px-6 py-4 hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 transition-all transform hover:scale-105 animate-pulse shadow-md"
                  >
                    <span className="text-lg font-semibold">{answer}</span>
                  </button>
                ))}
              </div>
              {/* Lifelines */}
              <div className="flex justify-center gap-6 mb-4">
                <button
                  onClick={useFiftyFifty}
                  disabled={!lifelines.fiftyFifty || gameOver}
                  className={`p-3 rounded-full shadow-lg transition-all transform hover:scale-110 ${
                    lifelines.fiftyFifty
                      ? "bg-yellow-500 hover:bg-yellow-600"
                      : "bg-gray-700 opacity-50 cursor-not-allowed"
                  }`}
                  title="50:50"
                >
                  <HelpCircle className="h-6 w-6 text-white" />
                </button>
                <button
                  onClick={usePhoneAFriend}
                  disabled={!lifelines.phoneAFriend || gameOver}
                  className={`p-3 rounded-full shadow-lg transition-all transform hover:scale-110 ${
                    lifelines.phoneAFriend
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-gray-700 opacity-50 cursor-not-allowed"
                  }`}
                  title="Phone a Friend"
                >
                  <Phone className="h-6 w-6 text-white" />
                </button>
                <button
                  onClick={useAskTheAudience}
                  disabled={!lifelines.askTheAudience || gameOver}
                  className={`p-3 rounded-full shadow-lg transition-all transform hover:scale-110 ${
                    lifelines.askTheAudience
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-gray-700 opacity-50 cursor-not-allowed"
                  }`}
                  title="Ask the Audience"
                >
                  <Users className="h-6 w-6 text-white" />
                </button>
              </div>
              <p className="text-gray-300 text-center font-semibold">
                Question {currentQuestionIndex + 1} of {quizQuestions.length}
              </p>
            </>
          ) : (
            <div className="text-center">
              <p
                className={`text-3xl font-extrabold mb-6 ${
                  xp > 0 ? "text-green-400" : "text-red-400"
                } animate-bounce drop-shadow-lg`}
              >
                {xp >= 1000
                  ? "Congratulations! Trivia Master! 🌟"
                  : xp > 0
                  ? `Game Over! You earned ${xp} XP! 🎉`
                  : "Game Over! No XP this time. 😢"}
              </p>
              <button
                onClick={resetGame}
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl px-8 py-4 hover:scale-105 transition-transform animate-pulse shadow-lg"
              >
                <span className="text-lg font-bold">Play Again</span>
              </button>
            </div>
          )}
          {/* XP Ladder */}
          <div className="mt-6">
            <p className="text-purple-300 mb-3 text-lg font-semibold">XP Ladder:</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {xpLadder.map((xpValue, index) => (
                <div
                  key={xpValue}
                  className={`p-3 rounded-lg text-center shadow-md ${
                    index === currentQuestionIndex && !gameOver
                      ? "bg-yellow-500/40 text-yellow-300 font-bold border-2 border-yellow-400"
                      : index < currentQuestionIndex
                      ? "bg-green-500/40 text-green-300 border-2 border-green-400"
                      : "bg-gray-800 text-gray-400 border-2 border-gray-700"
                  }`}
                >
                  {index + 1}. {xpValue} XP
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </GameLayout>
  );
}