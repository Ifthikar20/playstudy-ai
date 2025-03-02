"use client";

import { useState } from "react";
import Image from "next/image";
import { CreditCard, X } from "lucide-react";

interface QuizQuestion {
  question: string;
  answers: string[];
  correct_answer: string;
  difficulty: string;
}

interface CardItem {
  id: number;
  content: string;
  matched: boolean;
  flipped: boolean;
}

interface MemoryMatchGameProps {
  quizData: QuizQuestion[];
  onClose: () => void;
}

export default function MemoryMatchGame({ quizData, onClose }: MemoryMatchGameProps) {
  const limitedQuizData = quizData.slice(0, 4);

  const [cards, setCards] = useState<CardItem[]>(() => {
    const cardPairs: CardItem[] = limitedQuizData.flatMap((q, index) => [
      {
        id: index * 2,
        content: q.question,
        matched: false,
        flipped: false,
      },
      {
        id: index * 2 + 1,
        content: q.correct_answer,
        matched: false,
        flipped: false,
      },
    ]);
    return [...cardPairs].sort(() => Math.random() - 0.5);
  });
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matches, setMatches] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [hintUsed, setHintUsed] = useState(false);

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2 || cards.find((c) => c.id === id)?.flipped) return;

    const newCards = cards.map((card) =>
      card.id === id ? { ...card, flipped: true } : card
    );
    setCards(newCards);
    setFlippedCards((prev) => [...prev, id]);

    if (flippedCards.length === 1) {
      setMoves((prev) => prev + 1);
      const firstCard = cards.find((c) => c.id === flippedCards[0]);
      const secondCard = cards.find((c) => c.id === id);

      if (firstCard && secondCard) {
        const isMatch =
          (firstCard.content === limitedQuizData[Math.floor(firstCard.id / 2)].question &&
            secondCard.content === limitedQuizData[Math.floor(firstCard.id / 2)].correct_answer) ||
          (secondCard.content === limitedQuizData[Math.floor(secondCard.id / 2)].question &&
            firstCard.content === limitedQuizData[Math.floor(secondCard.id / 2)].correct_answer);

        if (isMatch) {
          setCards((prev) =>
            prev.map((card) =>
              card.id === firstCard.id || card.id === secondCard.id
                ? { ...card, matched: true }
                : card
            )
          );
          setMatches((prev) => prev + 1);
          setFlippedCards([]);
        } else {
          setTimeout(() => {
            setCards((prev) =>
              prev.map((card) =>
                card.id === firstCard.id || card.id === secondCard.id
                  ? { ...card, flipped: false }
                  : card
              )
            );
            setFlippedCards([]);
          }, 1500);
        }
      }
    }
  };

  const showHint = () => {
    if (hintUsed) return;
    setHintUsed(true);
    setCards((prev) => prev.map((card) => ({ ...card, flipped: true })));
    setTimeout(() => {
      setCards((prev) =>
        prev.map((card) => (card.matched ? card : { ...card, flipped: false }))
      );
    }, 2000);
  };

  // Check for game completion
  if (matches === limitedQuizData.length && matches > 0 && !gameCompleted) {
    setGameCompleted(true);
  }

  const resetGame = () => {
    setFlippedCards([]);
    setMatches(0);
    setMoves(0);
    setGameCompleted(false);
    setHintUsed(false);

    const cardPairs: CardItem[] = limitedQuizData.flatMap((q, index) => [
      {
        id: index * 2,
        content: q.question,
        matched: false,
        flipped: false,
      },
      {
        id: index * 2 + 1,
        content: q.correct_answer,
        matched: false,
        flipped: false,
      },
    ]);
    const shuffledCards = [...cardPairs].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-4xl border border-purple-500/30 relative">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-purple-400">Memory Match</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full">
            <X className="h-6 w-6 text-gray-300" />
          </button>
        </div>

        <div className="flex justify-between mb-4 text-gray-300">
          <p>Matches: {matches}/{limitedQuizData.length}</p>
          <div className="flex gap-4">
            <button
              onClick={showHint}
              disabled={hintUsed}
              className={`px-3 py-1 rounded-lg text-sm ${
                hintUsed
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {hintUsed ? "Hint Used" : "Get Hint"}
            </button>
            <p>Moves: {moves}</p>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {cards.map((card) => (
            <div
              key={card.id}
              onClick={() => handleCardClick(card.id)}
              className={`card-hover aspect-square flex items-center justify-center p-2 cursor-pointer transition-all duration-300 transform hover:scale-105 ${
                card.flipped || card.matched
                  ? "bg-purple-600 text-white"
                  : "bg-gray-700 text-gray-300"
              } ${card.matched ? "opacity-50" : ""}`}
            >
              {card.flipped || card.matched ? (
                <span className="text-xs text-center">{card.content}</span>
              ) : (
                <CreditCard className="h-8 w-8 animate-pulse" />
              )}
            </div>
          ))}
        </div>

        {gameCompleted && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-xl">
            <div className="bg-gray-800 p-6 rounded-lg text-center border border-purple-500/50">
              <Image
                src="https://media.giphy.com/media/xT5LMWNFkMJiPjaMve/giphy.gif"
                alt="Victory GIF"
                width={200}
                height={200}
                className="mx-auto mb-4 animate-bounce"
                unoptimized
              />
              <h3 className="text-xl font-bold text-purple-400 mb-2">You Won!</h3>
              <p className="text-gray-300 mb-4">Completed in {moves} moves</p>
              <div className="flex gap-4 justify-center">
                <button
                  onClick={resetGame}
                  className="btn-primary px-4 py-2 hover:bg-purple-700 transition-colors"
                >
                  Play Again
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-gray-700 rounded-lg text-gray-300 hover:bg-gray-600 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}