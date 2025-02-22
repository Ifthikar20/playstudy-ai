"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image"; // Import Next.js Image component
import { Brain, Gamepad, Book } from "lucide-react";
import GameModal from "@/app/dashboard/_components/GameModal";

interface User {
  name: string | null;
  email: string;
  image: string | null;
}

// Predefine game data to avoid repetition in JSX
const GAMES = {
  "Quick Quiz": {
    gradient: "from-red-900 to-red-700",
    textColor: "text-red-100",
    gif: "https://media.giphy.com/media/26FPyQsENxP6P0AOk/giphy.gif",
    description: "Rapid-fire questions.",
    facts: "Tests quick thinking.",
    difficulties: ["Simple", "Tough"],
    knownFor: "Speed & accuracy",
  },
  Hangman: {
    gradient: "from-blue-900 to-blue-700",
    textColor: "text-blue-100",
    gif: "https://media.giphy.com/media/l0MYt5jPRARvPnq92/giphy.gif",
    description: "Guess the word letter by letter.",
    facts: "Improves vocabulary.",
    difficulties: ["Easy", "Hard"],
    knownFor: "Addictive gameplay",
  },
  Millionaire: {
    gradient: "from-purple-900 to-purple-700",
    textColor: "text-purple-100",
    gif: "https://media.giphy.com/media/3o6Zt6ML6BicZ3gL6M/giphy.gif",
    description: "Answer trivia questions.",
    facts: "TV show format.",
    difficulties: ["Progressive", "Challenging"],
    knownFor: "Trivia & lifelines",
  },
  "Memory Match": {
    gradient: "from-green-900 to-green-700",
    textColor: "text-green-100",
    gif: "https://media.giphy.com/media/xT5LMWNFkMJiPjaMve/giphy.gif",
    description: "Match pairs of cards.",
    facts: "Boosts memory skills.",
    difficulties: ["Easy", "Complex"],
    knownFor: "Fun recall challenge",
  },
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<"active" | "game" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const router = useRouter();

  // Memoize fetchSession to prevent unnecessary re-renders
  const fetchSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/session", { cache: "no-store" });
      if (!response.ok) throw new Error("Session fetch failed");
      const data = await response.json();
      if (data.user) {
        setUser(data.user);
      } else {
        router.push("/signin");
      }
    } catch (error) {
      console.error("Failed to fetch session:", error);
      router.push("/signin");
    }
  }, [router]);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  // Memoize sign out handler
  const handleSignOut = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/signout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      if (!response.ok) throw new Error("Sign out failed");
      const { redirectUrl } = await response.json();
      window.location.href = redirectUrl;
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  }, []);

  // Memoize game click handler
  const handleGameClick = useCallback((gameTitle: string) => {
    setSelectedGame(gameTitle);
    setIsModalOpen(true);
  }, []);

  if (!user) return <div className="text-center p-8">Loading...</div>;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <div
          className="card-hover p-3 sm:p-4 cursor-pointer transition-colors duration-200 hover:bg-purple-900"
          onClick={() => setActiveSection(activeSection === "active" ? null : "active")}
        >
          <div className="flex items-center gap-3 mb-2">
            <Brain className="h-6 w-6 text-purple-500" />
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Active Learning</h2>
          </div>
          <p className="text-gray-400 text-xs">
            Engage with interactive quizzes and games to boost retention.
          </p>
        </div>

        <div
          className="card-hover p-3 sm:p-4 cursor-pointer transition-colors duration-200 hover:bg-purple-900"
          onClick={() => setActiveSection(activeSection === "game" ? null : "game")}
        >
          <div className="flex items-center gap-3 mb-2">
            <Gamepad className="h-6 w-6 text-purple-500" />
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Game-Based Learning</h2>
          </div>
          <p className="text-gray-400 text-xs">Turn subjects into fun, AI-powered games.</p>
        </div>

        <div className="card-hover p-3 sm:p-4">
          <div className="flex items-center gap-3 mb-2">
            <Book className="h-6 w-6 text-purple-500" />
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Note Transformation</h2>
          </div>
          <p className="text-gray-400 text-xs">Convert your notes into interactive experiences.</p>
        </div>
      </div>

      {/* Active Learning Section */}
      {activeSection === "active" && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div
            className={`interactive-card bg-gradient-to-br ${GAMES["Quick Quiz"].gradient} p-3 sm:p-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer`}
            onClick={() => handleGameClick("Quick Quiz")}
          >
            <Image
              src={GAMES["Quick Quiz"].gif}
              alt="Quiz GIF"
              width={300}
              height={128}
              className="w-full h-32 object-cover rounded-t-lg mb-3"
              unoptimized // Use unoptimized for GIFs as Next.js doesn't optimize animated images
            />
            <h3 className="text-lg font-bold text-white mb-2">Quick Quiz</h3>
            <p className={`${GAMES["Quick Quiz"].textColor} text-xs mb-1`}>
              <span className="font-semibold text-yellow-300">Description:</span>{" "}
              {GAMES["Quick Quiz"].description}
            </p>
            <p className={`${GAMES["Quick Quiz"].textColor} text-xs mb-1`}>
              <span className="font-semibold text-yellow-300">Facts:</span> {GAMES["Quick Quiz"].facts}
            </p>
            <p className={`${GAMES["Quick Quiz"].textColor} text-xs mb-1`}>
              <span className="font-semibold text-yellow-300">Difficulties:</span>{" "}
              <span className="text-green-400">{GAMES["Quick Quiz"].difficulties[0]}</span> to{" "}
              <span className="text-red-400">{GAMES["Quick Quiz"].difficulties[1]}</span>
            </p>
            <p className={`${GAMES["Quick Quiz"].textColor} text-xs`}>
              <span className="font-semibold text-yellow-300">Known For:</span>{" "}
              {GAMES["Quick Quiz"].knownFor}
            </p>
          </div>
        </div>
      )}

      {/* Game-Based Learning Section */}
      {activeSection === "game" && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(GAMES)
            .filter(([game]) => game !== "Quick Quiz")
            .map(([gameTitle, game]) => (
              <div
                key={gameTitle}
                className={`interactive-card bg-gradient-to-br ${game.gradient} p-3 sm:p-4 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 cursor-pointer`}
                onClick={() => handleGameClick(gameTitle)}
              >
                <Image
                  src={game.gif}
                  alt={`${gameTitle} GIF`}
                  width={300}
                  height={128}
                  className="w-full h-32 object-cover rounded-t-lg mb-3"
                  unoptimized // Use unoptimized for GIFs
                />
                <h3 className="text-lg font-bold text-white mb-2">{gameTitle}</h3>
                <p className={`${game.textColor} text-xs mb-1`}>
                  <span className="font-semibold text-yellow-300">Description:</span> {game.description}
                </p>
                <p className={`${game.textColor} text-xs mb-1`}>
                  <span className="font-semibold text-yellow-300">Facts:</span> {game.facts}
                </p>
                <p className={`${game.textColor} text-xs mb-1`}>
                  <span className="font-semibold text-yellow-300">Difficulties:</span>{" "}
                  <span className="text-green-400">{game.difficulties[0]}</span> to{" "}
                  <span className="text-red-400">{game.difficulties[1]}</span>
                </p>
                <p className={`${game.textColor} text-xs`}>
                  <span className="font-semibold text-yellow-300">Known For:</span> {game.knownFor}
                </p>
              </div>
            ))}
        </div>
      )}

      {/* Game Modal */}
      {isModalOpen && selectedGame && (
        <GameModal gameTitle={selectedGame} onClose={() => setIsModalOpen(false)} />
      )}

      <div className="mt-6 text-center">
        <button onClick={handleSignOut} className="btn-primary text-sm sm:text-base">
          Sign Out
        </button>
      </div>
    </div>
  );
}