"use client";

import { Rocket } from "lucide-react";
import { useState, useEffect } from "react";
import { SessionUser } from "@/app/api/auth/session/route";
import { useGameContext } from "./GameContext";

export default function Header() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const { gameState } = useGameContext();
  const { xp, level } = gameState;

  useEffect(() => {
    const fetchUser = async () => {
      const response = await fetch("/api/auth/session");
      const data = await response.json();
      setUser(data.user);
    };
    fetchUser();
  }, []);

  // Calculate progress percentage for the current level
  const xpForCurrentLevel = (level - 1) * 100; // XP at start of current level
  const xpForNextLevel = level * 100; // XP needed for next level
  const progress = level >= 100 
    ? 100 // Full bar if max level
    : ((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

  return (
    <header className="p-4 sm:p-5 shadow-sm border-b border-gray-800 bg-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
      {/* Left side - XP Progress Bar and Level */}
      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 w-full sm:w-auto">
        <div className="flex flex-col w-full max-w-xs">
          <div className="text-sm text-gray-300 mb-1">
            XP: <span className="text-blue-400 font-semibold">{xp}</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div
              className="bg-blue-400 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        <div className="text-sm text-gray-300">
          Level: <span className="text-green-400 font-semibold">{level}</span>
        </div>
      </div>

      {/* Right side - User info and upgrade option */}
      <div className="flex items-center gap-3 sm:gap-4">
        {user && (
          <h1 className="text-sm sm:text-lg font-semibold flex gap-1">
            <span>Welcome,</span>
            <span className="text-purple-400">
              {user.name?.split(" ")[0] || "User"} 👋
            </span>
          </h1>
        )}
        <Rocket className="h-5 w-5 text-purple-500" />
        <span className="text-xs sm:text-sm bg-purple-600 px-2 py-1 rounded-full hover:bg-purple-700 transition-all">
          Upgrade to Pro - $9.99/mo
        </span>
      </div>
    </header>
  );
}