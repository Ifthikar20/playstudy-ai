"use client";

import { useEffect, useState, useCallback } from "react";
import { Phone, Users, HelpCircle } from "lucide-react";
import { useGameContext } from "@/app/dashboard/_components/GameContext";

interface QuizQuestion {
  question: string;
  answers: string[];
  correct_answer: string;
  difficulty: string;
}

interface MillionaireGameProps {
  quizData: QuizQuestion[];
  onClose: () => void;
}

export default function MillionaireGame({ quizData, onClose }: MillionaireGameProps) {
  const { gameState, setGameState } = useGameContext();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [xp, setXp] = useState(0);
  const [lifelines, setLifelines] = useState({
    fiftyFifty: true,
    phoneAFriend: true,
    askTheAudience: true,
  });
  const [currentAnswers, setCurrentAnswers] = useState<string[]>([]);
  const [result, setResult] = useState<"win" | "lose" | null>(null);

  // Calculate XP values based on difficulty
  const calculateXpValue = (index: number, difficulty: string) => {
    const baseValue = 10 * (index + 1);
    return difficulty === "Easy" ? baseValue : baseValue * 2;
  };

  // Get XP values for each question
  const xpLadder = quizData.map((q, index) => 
    calculateXpValue(index, q.difficulty)
  );

  // Initialize the game
  useEffect(() => {
    if (quizData && quizData.length > 0) {
      setCurrentQuestionIndex(0);
      setGameOver(false);
      setXp(0);
      setLifelines({
        fiftyFifty: true,
        phoneAFriend: true,
        askTheAudience: true,
      });
      setCurrentAnswers([...quizData[0].answers]);
      setResult(null);
    }
  }, [quizData]);

  // Update current answers when question changes
  useEffect(() => {
    if (quizData && quizData[currentQuestionIndex]) {
      setCurrentAnswers([...quizData[currentQuestionIndex].answers]);
    }
  }, [quizData, currentQuestionIndex]);

  const handleAnswer = (selectedAnswer: string) => {
    if (gameOver || !quizData || quizData.length === 0) return;

    const correctAnswer = quizData[currentQuestionIndex].correct_answer;
    
    if (selectedAnswer === correctAnswer) {
      // Correct answer
      const newXp = xp + xpLadder[currentQuestionIndex];
      setXp(newXp);
      
      if (currentQuestionIndex + 1 < quizData.length) {
        // Move to next question
        setTimeout(() => {
          setCurrentQuestionIndex(currentQuestionIndex + 1);
        }, 1000);
      } else {
        // Game completed successfully
        setGameOver(true);
        setResult("win");
        
        // Update global game state
        setGameState({
          winnings: `$${newXp}`,
          xp: gameState.xp + newXp,
          gameOver: true
        });
      }
    } else {
      // Wrong answer
      setGameOver(true);
      setResult("lose");
      
      // Still award XP for questions answered correctly
      if (xp > 0) {
        setGameState({
          xp: gameState.xp + xp
        });
      }
    }
  };

  const useFiftyFifty = () => {
    if (!lifelines.fiftyFifty || gameOver || !quizData || quizData.length === 0) return;
    
    const correctAnswer = quizData[currentQuestionIndex].correct_answer;
    const incorrectAnswers = quizData[currentQuestionIndex].answers.filter(
      (ans) => ans !== correctAnswer
    );
    
    // Randomly select two incorrect answers to keep (along with the correct one)
    const randomIncorrect = incorrectAnswers.sort(() => 0.5 - Math.random()).slice(0, 1);
    setCurrentAnswers([correctAnswer, ...randomIncorrect].sort(() => 0.5 - Math.random()));
    setLifelines((prev) => ({ ...prev, fiftyFifty: false }));
  };

  const usePhoneAFriend = () => {
    if (!lifelines.phoneAFriend || gameOver || !quizData || quizData.length === 0) return;
    
    const correctAnswer = quizData[currentQuestionIndex].correct_answer;
    alert(`Your friend suggests: "${correctAnswer}" (75% confidence)`);
    setLifelines((prev) => ({ ...prev, phoneAFriend: false }));
  };

  const useAskTheAudience = () => {
    if (!lifelines.askTheAudience || gameOver || !quizData || quizData.length === 0) return;
    
    const correctAnswer = quizData[currentQuestionIndex].correct_answer;
    const audienceVotes: Record<string, number> = {};
    
    // Assign votes with higher probability for the correct answer
    quizData[currentQuestionIndex].answers.forEach((ans) => {
      audienceVotes[ans] = ans === correctAnswer 
        ? Math.floor(Math.random() * 30) + 40 // 40-70% for correct answer
        : Math.floor(Math.random() * 20);     // 0-20% for wrong answers
    });
    
    // Normalize percentages to sum to 100%
    const total = Object.values(audienceVotes).reduce((sum, vote) => sum + vote, 0);
    const percentages = Object.entries(audienceVotes).map(([ans, votes]) => 
      `${ans}: ${Math.round(votes / total * 100)}%`
    );
    
    alert(`Audience votes:\n${percentages.join("\n")}`);
    setLifelines((prev) => ({ ...prev, askTheAudience: false }));
  };

  const resetGame = useCallback(() => {
    if (quizData && quizData.length > 0) {
      setCurrentQuestionIndex(0);
      setGameOver(false);
      setXp(0);
      setLifelines({
        fiftyFifty: true,
        phoneAFriend: true,
        askTheAudience: true,
      });
      setCurrentAnswers([...quizData[0].answers]);
      setResult(null);
    }
  }, [quizData]);

  // If no quiz data is provided, don't render anything
  if (!quizData || quizData.length === 0) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="relative bg-gray-900 p-6 rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 left-0 right-0 h-1/2 bg-gradient-to-b from-blue-900/40 to-transparent rounded-t-full opacity-50" />
          <div className="absolute top-10 left-10 right-10 h-48 bg-blue-800/30 rounded-full blur-2xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-800/20 rounded-full blur-3xl animate-pulse-slow" />
        </div>

        {/* Main content */}
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Millionaire Challenge
            </h2>
            <button 
              onClick={onClose}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-full transition-colors"
            >
              Exit Game
            </button>
          </div>

          {!gameOver ? (
            <>
              {/* Current question */}
              <div className="bg-gradient-to-r from-blue-600/30 to-purple-600/30 p-4 rounded-lg mb-6 shadow-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-blue-300">Question {currentQuestionIndex + 1} of {quizData.length}</span>
                  <span className="text-green-300">
                    XP Gain: <span className="text-yellow-300">{xpLadder[currentQuestionIndex]}</span>
                  </span>
                </div>
                <p className="text-xl md:text-2xl font-bold text-white mb-2">
                  {quizData[currentQuestionIndex].question}
                </p>
                <p className="text-sm text-blue-200">
                  Difficulty: <span className={`${quizData[currentQuestionIndex].difficulty === "Easy" ? "text-green-400" : "text-yellow-400"}`}>
                    {quizData[currentQuestionIndex].difficulty}
                  </span>
                </p>
              </div>

              {/* Answer options */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {currentAnswers.map((answer) => (
                  <button
                    key={answer}
                    onClick={() => handleAnswer(answer)}
                    className="bg-gray-800 border-2 border-blue-500/30 text-white rounded-xl px-6 py-4 hover:bg-gradient-to-r hover:from-blue-600/50 hover:to-purple-600/50 transition-all transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
                  >
                    <span className="text-lg font-semibold">{answer}</span>
                  </button>
                ))}
              </div>

              {/* Lifelines */}
              <div className="flex justify-center gap-6 mb-4">
                <button
                  onClick={useFiftyFifty}
                  disabled={!lifelines.fiftyFifty}
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
                  disabled={!lifelines.phoneAFriend}
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
                  disabled={!lifelines.askTheAudience}
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

              {/* XP status */}
              <div className="mt-4 text-center text-white">
                <p>Total XP earned: <span className="text-yellow-300 font-bold">{xp}</span></p>
              </div>
            </>
          ) : (
            // Game over screen
            <div className="text-center py-8">
              <h3 className={`text-3xl font-bold mb-6 ${
                result === "win" ? "text-green-400" : "text-red-400"
              }`}>
                {result === "win" 
                  ? "Congratulations! You completed the challenge! 🏆" 
                  : "Game Over! Better luck next time! 💫"}
              </h3>
              
              <div className="bg-gray-800/80 p-4 rounded-lg mb-6">
                <p className="text-xl text-white mb-2">
                  You earned: <span className="text-yellow-300 font-bold">{xp} XP</span>
                </p>
                <p className="text-gray-300">
                  {result === "win" 
                    ? "You answered all questions correctly!" 
                    : "Keep practicing to improve your score."}
                </p>
              </div>
              
              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetGame}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
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
          )}
          
          {/* XP ladder */}
          <div className="mt-6">
            <p className="text-blue-300 mb-2 text-sm font-semibold">XP Ladder:</p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 text-xs">
              {xpLadder.map((xpValue, index) => (
                <div
                  key={index}
                  className={`p-2 rounded-lg text-center ${
                    index === currentQuestionIndex && !gameOver
                      ? "bg-yellow-500/40 text-yellow-100 font-bold border border-yellow-400"
                      : index < currentQuestionIndex
                      ? "bg-green-500/40 text-green-100 border border-green-400"
                      : "bg-gray-800 text-gray-400 border border-gray-700"
                  }`}
                >
                  {index + 1}. {xpValue} XP
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}