"use client";

import { useState, useEffect, useCallback } from "react";
import { Clock, Zap, Award, AlertTriangle, X, Check, ChevronRight } from "lucide-react";
import { useGameContext } from "@/app/dashboard/_components/GameContext";

interface QuizQuestion {
  question: string;
  answers: string[];
  correct_answer: string;
  difficulty: string;
}

interface QuickQuizGameProps {
  quizData: QuizQuestion[];
  onClose: () => void;
}

// Available timer options in seconds
const TIMER_OPTIONS = [
  { label: "60 sec", value: 60 },
  { label: "2 min", value: 120 },
  { label: "5 min", value: 300 },
  { label: "10 min", value: 600 },
  { label: "15 min", value: 900 },
  { label: "20 min", value: 1200 },
  { label: "30 min", value: 1800 },
  { label: "1 hr", value: 3600 },
  { label: "3 hr", value: 10800 }
];

export default function QuickQuizGame({ quizData, onClose }: QuickQuizGameProps) {
  const { gameState, setGameState } = useGameContext();
  const [selectedTimer, setSelectedTimer] = useState<number | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [answerSubmitted, setAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStats, setGameStats] = useState({
    correct: 0,
    incorrect: 0,
    timeBonus: 0,
    streakBonus: 0,
    finalScore: 0
  });

  // Format time
  const formatTime = useCallback((seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hrs > 0) {
      return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  // Timer effect
  useEffect(() => {
    if (!gameStarted || timeRemaining === null) return;
    
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 0) {
          clearInterval(timer);
          if (!gameOver) {
            endGame();
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [gameStarted, timeRemaining]);

  // Start the game
  const startGame = () => {
    if (selectedTimer === null) return;
    setTimeRemaining(selectedTimer);
    setGameStarted(true);
    setCurrentQuestionIndex(0);
    setScore(0);
    setStreak(0);
    setGameStats({
      correct: 0,
      incorrect: 0,
      timeBonus: 0,
      streakBonus: 0,
      finalScore: 0
    });
  };

  // End the game
  const endGame = () => {
    setGameOver(true);
    
    // Calculate final stats
    const timeBonus = timeRemaining ? Math.floor(timeRemaining / 10) : 0;
    const streakBonus = Math.floor(streak * 5);
    const finalScore = score + timeBonus + streakBonus;
    
    setGameStats({
      correct: gameStats.correct,
      incorrect: gameStats.incorrect,
      timeBonus,
      streakBonus,
      finalScore
    });
    
    // Update global game state
    setGameState({
      winnings: `$${finalScore}`,
      xp: gameState.xp + finalScore,
      gameOver: true
    });
  };

  // Handle answer selection
  const handleAnswerClick = (answer: string) => {
    if (answerSubmitted) return;
    setSelectedAnswer(answer);
  };

  // Submit the selected answer
  const handleSubmitAnswer = () => {
    if (!selectedAnswer || answerSubmitted) return;
    
    const currentQuestion = quizData[currentQuestionIndex];
    const isCorrect = selectedAnswer === currentQuestion.correct_answer;
    
    if (isCorrect) {
      // Calculate points based on difficulty
      const difficultyMultiplier = currentQuestion.difficulty === "Easy" ? 10 : 20;
      const questionScore = difficultyMultiplier;
      
      // Update score and stats
      setScore(prev => prev + questionScore);
      setStreak(prev => prev + 1);
      setGameStats(prev => ({
        ...prev,
        correct: prev.correct + 1
      }));
    } else {
      // Reset streak on wrong answer
      setStreak(0);
      setGameStats(prev => ({
        ...prev,
        incorrect: prev.incorrect + 1
      }));
    }
    
    setAnswerSubmitted(true);
    
    // Move to next question after a short delay
    setTimeout(() => {
      if (currentQuestionIndex < quizData.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
        setAnswerSubmitted(false);
      } else {
        endGame();
      }
    }, 1500);
  };

  // Reset the game
  const resetGame = () => {
    setSelectedTimer(null);
    setTimeRemaining(null);
    setGameStarted(false);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setAnswerSubmitted(false);
    setScore(0);
    setStreak(0);
    setGameOver(false);
    setGameStats({
      correct: 0,
      incorrect: 0,
      timeBonus: 0,
      streakBonus: 0,
      finalScore: 0
    });
  };

  if (!quizData || quizData.length === 0) {
    return null;
  }

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
            <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
              Quick Quiz Challenge
            </h2>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
            >
              Exit Game
            </button>
          </div>

          {!gameStarted && !gameOver ? (
            // Timer selection screen
            <div className="bg-gray-800/80 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Clock className="h-5 w-5 mr-2 text-purple-400" />
                Select Quiz Timer
              </h3>
              
              <div className="grid grid-cols-3 gap-3 mb-6">
                {TIMER_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedTimer(option.value)}
                    className={`p-3 rounded-lg transition-all ${
                      selectedTimer === option.value
                        ? "bg-purple-600 text-white border-2 border-purple-400"
                        : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              
              <div className="bg-gray-700/50 p-4 rounded-lg mb-6">
                <p className="text-sm text-gray-300 mb-2">
                  <Zap className="h-4 w-4 inline-block mr-1 text-yellow-400" />
                  <span className="font-semibold">Game Rules:</span>
                </p>
                <ul className="text-sm text-gray-300 space-y-1 list-disc pl-5">
                  <li>Answer as many questions as you can before time runs out</li>
                  <li>Earn 10 points for Easy questions, 20 for Medium questions</li>
                  <li>Consecutive correct answers build a streak for bonus points</li>
                  <li>Time remaining adds bonus points to your final score</li>
                  <li>Challenge yourself to beat your high score!</li>
                </ul>
              </div>
              
              <button
                onClick={startGame}
                disabled={selectedTimer === null}
                className={`w-full py-3 rounded-lg text-white font-bold flex items-center justify-center gap-2 ${
                  selectedTimer === null
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                }`}
              >
                <Award className="h-5 w-5" />
                Start Challenge
              </button>
            </div>
          ) : gameOver ? (
            // Game over screen
            <div className="text-center py-8">
              <h3 className="text-3xl font-bold mb-6 text-purple-400">
                Challenge Complete! 🏆
              </h3>
              
              <div className="bg-gray-800/80 p-6 rounded-lg mb-6">
                <p className="text-xl text-white mb-4">
                  Final Score: <span className="text-yellow-300 font-bold">{gameStats.finalScore} points</span>
                </p>
                
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-green-400 font-semibold">Correct Answers</p>
                    <p className="text-2xl">{gameStats.correct}</p>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-red-400 font-semibold">Incorrect Answers</p>
                    <p className="text-2xl">{gameStats.incorrect}</p>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-blue-400 font-semibold">Time Bonus</p>
                    <p className="text-2xl">+{gameStats.timeBonus}</p>
                  </div>
                  <div className="bg-gray-700/50 p-3 rounded-lg">
                    <p className="text-purple-400 font-semibold">Streak Bonus</p>
                    <p className="text-2xl">+{gameStats.streakBonus}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetGame}
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Play Again
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                >
                  Exit Game
                </button>
              </div>
            </div>
          ) : (
            // Active gameplay
            <>
              {/* Timer and score display */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center bg-gray-800/80 px-4 py-2 rounded-lg">
                  <Clock className="h-5 w-5 mr-2 text-purple-400" />
                  <span className={`font-mono text-lg font-bold ${
                    timeRemaining && timeRemaining < 30 ? "text-red-400 animate-pulse" : "text-white"
                  }`}>
                    {timeRemaining !== null ? formatTime(timeRemaining) : "00:00"}
                  </span>
                </div>
                <div className="flex space-x-4">
                  <div className="bg-gray-800/80 px-4 py-2 rounded-lg">
                    <span className="text-gray-400 text-sm mr-2">Score:</span>
                    <span className="text-yellow-300 font-bold">{score}</span>
                  </div>
                  <div className="bg-gray-800/80 px-4 py-2 rounded-lg">
                    <span className="text-gray-400 text-sm mr-2">Streak:</span>
                    <span className={`font-bold ${streak >= 3 ? "text-green-400" : "text-white"}`}>
                      {streak}
                    </span>
                  </div>
                </div>
              </div>

              {/* Question progress */}
              <div className="w-full bg-gray-800 h-2 rounded-full mb-6 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-full"
                  style={{ width: `${((currentQuestionIndex + 1) / quizData.length) * 100}%` }}
                ></div>
              </div>

              {/* Current question */}
              <div className="bg-gradient-to-r from-purple-600/30 to-pink-600/30 p-4 rounded-lg mb-6 shadow-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-purple-300">Question {currentQuestionIndex + 1} of {quizData.length}</span>
                  <span className="text-green-300">
                    Difficulty: <span className={quizData[currentQuestionIndex].difficulty === "Easy" 
                      ? "text-green-400" 
                      : "text-yellow-400"}>
                      {quizData[currentQuestionIndex].difficulty}
                    </span>
                  </span>
                </div>
                <p className="text-xl md:text-2xl font-bold text-white">
                  {quizData[currentQuestionIndex].question}
                </p>
              </div>

              {/* Answer options */}
              <div className="grid grid-cols-1 gap-3 mb-6">
                {quizData[currentQuestionIndex].answers.map((answer) => (
                  <button
                    key={answer}
                    onClick={() => handleAnswerClick(answer)}
                    disabled={answerSubmitted}
                    className={`p-4 rounded-lg text-left text-white transition-all ${
                      answerSubmitted
                        ? answer === quizData[currentQuestionIndex].correct_answer
                          ? "bg-green-600 border-2 border-green-400" // Correct answer
                          : selectedAnswer === answer
                            ? "bg-red-600 border-2 border-red-400" // Selected wrong answer
                            : "bg-gray-700 opacity-70"  // Other answers when submitted
                        : selectedAnswer === answer
                          ? "bg-purple-600 border-2 border-purple-400" // Selected answer
                          : "bg-gray-700 hover:bg-gray-600" // Unselected answer
                    }`}
                  >
                    <div className="flex items-center">
                      {answerSubmitted && (
                        answer === quizData[currentQuestionIndex].correct_answer
                          ? <Check className="h-5 w-5 mr-2 text-green-300" />
                          : selectedAnswer === answer
                            ? <X className="h-5 w-5 mr-2 text-red-300" />
                            : <span className="w-5 mr-2"></span>
                      )}
                      <span>{answer}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Submit button */}
              {!answerSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedAnswer}
                  className={`w-full py-3 rounded-lg text-white font-bold ${
                    selectedAnswer
                      ? "bg-purple-600 hover:bg-purple-700"
                      : "bg-gray-600 cursor-not-allowed"
                  }`}
                >
                  Submit Answer
                </button>
              ) : (
                <div className="text-center">
                  <p className={`text-lg font-semibold mb-3 ${
                    selectedAnswer === quizData[currentQuestionIndex].correct_answer
                      ? "text-green-400"
                      : "text-red-400"
                  }`}>
                    {selectedAnswer === quizData[currentQuestionIndex].correct_answer
                      ? "Correct! ✓"
                      : "Incorrect! ✗"
                    }
                  </p>
                  <div className="animate-pulse">
                    <ChevronRight className="h-6 w-6 mx-auto text-white" />
                    <p className="text-sm text-gray-400">Next question in a moment...</p>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}