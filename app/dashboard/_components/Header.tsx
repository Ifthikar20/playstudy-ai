"use client";

import { Rocket } from "lucide-react";
import { useState, useEffect } from "react";
import { SessionUser } from "@/app/api/auth/session/route";
import { useGameContext } from "./GameContext";

// Define custom level names with witty descriptions - expanded to 25 levels
const LEVEL_NAMES = [
  "Complete Novice", // Level 1 (0-99 XP)
  "Button Masher", // Level 2 (100-199 XP)
  "Confused Learner", // Level 3 (200-299 XP)
  "Knowledge Sponge", // Level 4 (300-399 XP)
  "Quiz Taker", // Level 5 (400-499 XP)
  "Getting Somewhere", // Level 6 (500-599 XP)
  "Impressive Recall", // Level 7 (600-699 XP)
  "Trivia Enthusiast", // Level 8 (700-799 XP)
  "Knowledge Ninja", // Level 9 (800-899 XP)
  "Almost Einstein", // Level 10 (900-999 XP)
  "Study Master", // Level 11 (1000-1099 XP)
  "Brain Overclocked", // Level 12 (1100-1199 XP)
  "Memory Wizard", // Level 13 (1200-1299 XP)
  "Walking Encyclopedia", // Level 14 (1300-1399 XP)
  "Genius Status", // Level 15 (1400-1499 XP)
  "Limitless Mind", // Level 16 (1500-1599 XP)
  "Neural Networker", // Level 17 (1600-1699 XP)
  "Knowledge Architect", // Level 18 (1700-1799 XP)
  "Information Alchemist", // Level 19 (1800-1899 XP) 
  "Intellectual Titan", // Level 20 (1900-1999 XP)
  "Master of Mastery", // Level 21 (2000-2099 XP)
  "Quantum Thinker", // Level 22 (2100-2199 XP)
  "Wisdom Distillery", // Level 23 (2200-2299 XP)
  "Cosmic Intellect", // Level 24 (2300-2399 XP)
  "Transcendent Scholar" // Level 25 (2400+ XP)
];

export default function Header() {
  const [user, setUser] = useState<SessionUser | null>(null);
  const { gameState } = useGameContext();
  const { xp } = gameState;
  
  // Fix level calculation: 260 XP should be level 3, not level 1
  // Level is calculated as (XP / 100) + 1, but make sure it's properly rounded down
  const level = Math.floor(xp / 100) + 1;

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
  const progress = level >= 25 
    ? 100 // Full bar if max level
    : ((xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;
  
  // Get level name - cap at the highest defined level
  const levelIndex = Math.min(level - 1, LEVEL_NAMES.length - 1);
  const levelName = LEVEL_NAMES[levelIndex];
  
  // Calculate how much XP needed for next level
  const xpNeeded = level >= 25 ? 0 : xpForNextLevel - xp;

  return (
    <header className="p-4 sm:p-5 shadow-sm border-b border-gray-800 bg-gray-800 flex flex-col sm:flex-row justify-between items-center gap-4">
      {/* Left side - Enhanced XP Progress Bar and Level */}
      <div className="flex flex-col w-full sm:w-auto max-w-md">
        <div className="flex justify-between items-center mb-1">
          <div className="text-sm text-gray-300">
            <span className="text-blue-400 font-semibold">{xp} XP</span>
          </div>
          <div className="text-xs text-gray-400">
            {level < 25 ? `${xpNeeded} XP to next level` : "Max Level Reached!"}
          </div>
        </div>
        
        {/* Shortened progress bar with gradient and pulse effect */}
        <div className="w-full bg-gray-700/50 rounded-md h-3 p-0.5 backdrop-blur-sm overflow-hidden">
          <div
            className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 h-2 rounded-sm transition-all duration-500 relative"
            style={{ width: `${Math.min(progress, 100)}%` }}
          >
            {/* Subtle pulse effect */}
            <div className="absolute inset-0 bg-white/20 rounded-sm animate-pulse opacity-75"></div>
          </div>
        </div>
        
        {/* Level name display */}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-2 py-0.5 rounded-md mr-2">
              LVL {level}
            </div>
            <span className="text-sm font-medium bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {levelName}
            </span>
          </div>
          
          {/* Small badge showing if close to leveling up */}
          {progress > 85 && level < 25 && (
            <div className="text-xs bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded-full animate-pulse">
              Almost there!
            </div>
          )}
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
        <span className="text-xs sm:text-sm bg-purple-600 px-2 py-1 rounded-full hover:bg-purple-700 transition-all cursor-pointer shadow-lg shadow-purple-600/20">
          Upgrade to Pro - $9.99/mo
        </span>
      </div>
    </header>
  );
}