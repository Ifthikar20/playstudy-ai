"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X } from "lucide-react";

interface QuizQuestion {
  question: string;
  answers: string[];
  correct_answer: string;
  difficulty: string;
}

interface CrossWordGameProps {
  quizData: QuizQuestion[];
  onClose: () => void;
}

interface Cell {
  letter: string;
  userLetter: string;
  number?: number;
  isStart?: boolean;
  wordIndices: number[];
  direction?: "horizontal" | "vertical";
}

interface WordPosition {
  word: string;
  startX: number;
  startY: number;
  direction: "horizontal" | "vertical";
  question: string;
  hint: string;
  correctAttempt?: number;
}

export default function CrossWordGame({ quizData, onClose }: CrossWordGameProps) {
  const [grid, setGrid] = useState<Cell[][]>([]);
  const [wordPositions, setWordPositions] = useState<WordPosition[]>([]);
  const [totalXP, setTotalXP] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const MAX_ATTEMPTS = 3;
  const MAX_XP_PER_QUESTION = 20;
  const GRID_SIZE = 15;

  const extractWordAndHint = (correctAnswer: string) => {
    const fullAnswer = correctAnswer.replace(/^[A-D]\.\s*/, "").toLowerCase();
    const answerWords = fullAnswer.split(" ");
    const fillerWords = ["of", "and", "the", "in", "to", "a", "an"];
    const contentWords = answerWords.filter((word) => !fillerWords.includes(word));
    
    const wordToGuess = contentWords[contentWords.length - 1];
    const hint = fullAnswer.slice(0, fullAnswer.lastIndexOf(wordToGuess)).trim() + " ";
    return { word: wordToGuess, hint };
  };

  const findSharedLetter = (word1: string, word2: string) => {
    for (const char of word1) {
      if (word2.includes(char)) return char;
    }
    return null;
  };

  const canPlaceWord = (
    grid: Cell[][],
    word: string,
    x: number,
    y: number,
    direction: "horizontal" | "vertical",
  ) => {
    for (let i = 0; i < word.length; i++) {
      const newX = direction === "horizontal" ? x + i : x;
      const newY = direction === "vertical" ? y + i : y;

      if (newX >= GRID_SIZE || newY >= GRID_SIZE || newX < 0 || newY < 0) {
        return false;
      }

      const cell = grid[newY][newX];
      if (cell.letter && cell.letter !== word[i]) {
        return false;
      }
    }
    return true;
  };

  const placeWord = (
    grid: Cell[][],
    word: string,
    x: number,
    y: number,
    direction: "horizontal" | "vertical",
    wordIndex: number,
    number: number
  ) => {
    for (let i = 0; i < word.length; i++) {
      const newX = direction === "horizontal" ? x + i : x;
      const newY = direction === "vertical" ? y + i : y;

      if (newX >= GRID_SIZE || newY >= GRID_SIZE || newX < 0 || newY < 0) {
        console.error(`Out-of-bounds access at (${newX}, ${newY}) for word: ${word}`);
        return;
      }

      const cell = grid[newY][newX];
      grid[newY][newX] = {
        letter: word[i],
        userLetter: "",
        wordIndices: [...cell.wordIndices, wordIndex],
        ...(i === 0 && !cell.number && { number, isStart: true, direction }),
      };
    }
  };

  const generateCrossword = () => {
    const newGrid: Cell[][] = Array(GRID_SIZE)
      .fill(null)
      .map(() => Array(GRID_SIZE).fill({ letter: "", userLetter: "", wordIndices: [] }));
    const positions: WordPosition[] = [];

    quizData.forEach((item, index) => {
      const { word, hint } = extractWordAndHint(item.correct_answer);
      let placed = false;
      let attempts = 0;

      if (positions.length > 0) {
        while (!placed && attempts < 500) {
          const prevPos = positions[Math.floor(Math.random() * positions.length)];
          const sharedLetter = findSharedLetter(word, prevPos.word);
          if (!sharedLetter) {
            attempts++;
            continue;
          }

          const prevIndex = prevPos.word.indexOf(sharedLetter);
          const currIndex = word.indexOf(sharedLetter);
          const direction = prevPos.direction === "horizontal" ? "vertical" : "horizontal";
          const startX = direction === "horizontal" ? prevPos.startX + prevIndex - currIndex : prevPos.startX + prevIndex;
          const startY = direction === "vertical" ? prevPos.startY + prevIndex - currIndex : prevPos.startY + prevIndex;

          const wordLength = word.length;
          const endX = direction === "horizontal" ? startX + wordLength - 1 : startX;
          const endY = direction === "vertical" ? startY + wordLength - 1 : startY;
          if (
            startX < 0 ||
            startX >= GRID_SIZE ||
            startY < 0 ||
            startY >= GRID_SIZE ||
            endX >= GRID_SIZE ||
            endY >= GRID_SIZE
          ) {
            attempts++;
            continue;
          }

          if (canPlaceWord(newGrid, word, startX, startY, direction)) {
            placeWord(newGrid, word, startX, startY, direction, index, index + 1);
            positions.push({ word, startX, startY, direction, question: item.question, hint });
            placed = true;
          }
          attempts++;
        }
      }

      if (!placed) {
        let maxAttempts = 100;
        while (!placed && maxAttempts > 0) {
          const direction = Math.random() > 0.5 ? "horizontal" : "vertical";
          const maxStartX = direction === "horizontal" ? GRID_SIZE - word.length : GRID_SIZE - 1;
          const maxStartY = direction === "vertical" ? GRID_SIZE - word.length : GRID_SIZE - 1;
          const startX = Math.floor(Math.random() * (maxStartX + 1));
          const startY = Math.floor(Math.random() * (maxStartY + 1));

          if (canPlaceWord(newGrid, word, startX, startY, direction)) {
            placeWord(newGrid, word, startX, startY, direction, index, index + 1);
            positions.push({ word, startX, startY, direction, question: item.question, hint });
            placed = true;
          }
          maxAttempts--;
        }
      }

      if (!placed) {
        console.warn(`Failed to place word: ${word}`);
      }
    });

    setGrid(newGrid);
    setWordPositions(positions);
    console.log("Generated Grid:", newGrid);
    console.log("Word Positions:", positions);
  };

  useEffect(() => {
    generateCrossword();
  }, [quizData, generateCrossword]);

  const handleCellChange = (x: number, y: number, value: string) => {
    const newGrid = [...grid];
    if (newGrid[y][x].wordIndices.length > 0) {
      newGrid[y][x].userLetter = value.toLowerCase().slice(-1);
      setGrid(newGrid);
    }
  };

  const calculateXP = (attempt: number) => {
    switch (attempt) {
      case 1: return MAX_XP_PER_QUESTION; // 20 XP
      case 2: return Math.floor(MAX_XP_PER_QUESTION * 0.75); // 15 XP
      case 3: return Math.floor(MAX_XP_PER_QUESTION * 0.5); // 10 XP
      default: return 0;
    }
  };

  const handleSubmit = () => {
    if (attempts >= MAX_ATTEMPTS) return;

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    let newXP = totalXP;
    let allCorrect = true;

    wordPositions.forEach((pos) => {
      let isCorrect = true;
      for (let i = 0; i < pos.word.length; i++) {
        const x = pos.direction === "horizontal" ? pos.startX + i : pos.startX;
        const y = pos.direction === "vertical" ? pos.startY + i : pos.startY;
        if (grid[y][x].userLetter !== pos.word[i]) {
          isCorrect = false;
          break;
        }
      }

      if (isCorrect && !pos.correctAttempt) {
        const xpForQuestion = calculateXP(newAttempts);
        newXP += xpForQuestion;
        pos.correctAttempt = newAttempts;
      }

      if (!isCorrect) allCorrect = false;
    });

    setTotalXP(newXP);

    // End game if all correct (on any attempt) or max attempts reached
    if (allCorrect || newAttempts === MAX_ATTEMPTS) {
      setGameCompleted(true);
    }
  };

  const resetGame = () => {
    setTotalXP(0);
    setGameCompleted(false);
    setAttempts(0);
    generateCrossword();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-5xl border border-purple-500/30 relative flex">
        {/* Questions on Left */}
        <div className="w-1/3 pr-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-purple-400">Crossword Quiz</h2>
            <button onClick={onClose} className="p-2 hover:bg-gray-700 rounded-full">
              <X className="h-6 w-6 text-gray-300" />
            </button>
          </div>
          {!gameCompleted ? (
            <div>
              <h3 className="text-gray-300 mb-2">Questions:</h3>
              <ul className="list-decimal pl-5 text-gray-400 text-sm">
                {wordPositions.map((pos, index) => (
                  <li key={index} className="mb-2 leading-tight break-words">
                    {pos.question} <span className="text-purple-300">{pos.hint}</span> ({pos.direction === "horizontal" ? "Across" : "Down"})
                  </li>
                ))}
              </ul>
              <button
                onClick={handleSubmit}
                disabled={attempts >= MAX_ATTEMPTS}
                className={`px-4 py-2 rounded-lg text-white mt-4 transition-colors ${
                  attempts >= MAX_ATTEMPTS
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                Submit
              </button>
              <p className="text-gray-300 mt-2">XP: {totalXP}</p>
              <p className="text-gray-300 mt-1">Attempts Left: {MAX_ATTEMPTS - attempts}</p>
            </div>
          ) : (
            <div className="absolute inset-0 bg-black/80 flex items-center justify-center rounded-xl">
              <div className="bg-gray-800 p-6 rounded-lg text-center border border-purple-500/50">
                <Image
                  src="https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDZrYnZqdjkxMjF3MmppMW53cjFnOHV4dm9jNTIxNHUydGd6d2Y6ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fVEdYhyl70a7otSHjj/giphy.gif"
                  alt="Victory GIF"
                  width={200}
                  height={200}
                  className="mx-auto mb-4 animate-bounce"
                  unoptimized
                />
                <h3 className="text-xl font-bold text-purple-400 mb-2">
                  {attempts === 1 && totalXP === quizData.length * MAX_XP_PER_QUESTION
                    ? "Finished! Congratulations!"
                    : "Game Over!"}
                </h3>
                <p className="text-gray-300 mb-4">
                  You earned {totalXP} XP in {attempts} attempt{attempts !== 1 ? "s" : ""}
                </p>
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={resetGame}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 transition-colors text-white rounded-lg"
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

        {/* Crossword Grid */}
        <div className="flex-1">
          <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${GRID_SIZE}, 2rem)` }}>
            {grid.map((row, y) =>
              row.map((cell, x) => (
                <div
                  key={`${x}-${y}`}
                  className={`w-8 h-8 flex items-center justify-center text-white text-sm border relative ${
                    cell.wordIndices.length > 0
                      ? "bg-gray-700 border-gray-600"
                      : "bg-gray-900 border-gray-800"
                  }`}
                >
                  {cell.isStart && cell.number && (
                    <span className="absolute text-xs text-purple-300 -top-1 -left-1">{cell.number}</span>
                  )}
                  {cell.wordIndices.length > 0 && (
                    <input
                      type="text"
                      maxLength={1}
                      value={cell.userLetter}
                      onChange={(e) => handleCellChange(x, y, e.target.value)}
                      className="w-full h-full bg-transparent text-center text-white focus:outline-none"
                      style={{ caretColor: "white" }}
                    />
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}