// GameContext.tsx (snippet)
"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface GameState {
  winnings: string;
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
    currentQuestionIndex: 0,
    gameOver: false,
  });

  const updateGameState = (newState: Partial<GameState>) => {
    setGameState((prev) => ({ ...prev, ...newState }));
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