"use client";
import { createContext, useContext, useState, ReactNode } from "react";

// Function to convert winnings to XP
const convertWinningsToXP = (winnings: string): number => {
  const amount = parseInt(winnings.replace("$", "")) || 0;
  // Simple conversion: $1 = 10 XP, adjust this formula as needed
  return amount * 10;
};

// Function to calculate level from XP (1-100)
const calculateLevel = (xp: number): number => {
  // Simple leveling system: 100 XP per level, max level 100
  const level = Math.min(Math.floor(xp / 100) + 1, 100);
  return level;
};

interface GameState {
  winnings: string;
  xp: number;
  level: number;
  currentQuestionIndex: number;
  gameOver: boolean;
}

interface GameContextType {
  gameState: GameState;
  setGameState: (state: Partial<GameState>) => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [gameState, setGameState] = useState<GameState>({
    winnings: "$0",
    xp: 0,
    level: 1,
    currentQuestionIndex: 0,
    gameOver: false,
  });

  const updateGameState = (newState: Partial<GameState>) => {
    setGameState((prev) => {
      const updatedState = { ...prev, ...newState };
      // When winnings change, update XP and level
      if (newState.winnings !== undefined) {
        updatedState.xp = convertWinningsToXP(updatedState.winnings);
        updatedState.level = calculateLevel(updatedState.xp);
      }
      return updatedState;
    });
  };

  return (
    <GameContext.Provider value={{ gameState, setGameState: updateGameState }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error("useGameContext must be used within a GameProvider");
  }
  return context;
}