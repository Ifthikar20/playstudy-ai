"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import dynamic from 'next/dynamic';
import { getUserProfile } from '@/lib/api-client';
import Image from "next/image";
import { Brain, Gamepad, Book, FileText, PenLine, Upload, ArrowRight } from "lucide-react";
import GameModal from "@/app/dashboard/_components/GameModal";

const Hangman = dynamic(
  () => import("@/app/dashboard/_components/Games/HangmanGame"),
  { loading: () => <p>Loading game...</p>, ssr: false }
);

const MillionaireGame = dynamic(
  () => import("@/app/dashboard/_components/Games/MillionaireGame"),
  { loading: () => <p>Loading game...</p>, ssr: false }
);

const QuickQuizGame = dynamic(
  () => import("@/app/dashboard/_components/Games/QuickQuizGame"),
  { loading: () => <p>Loading game...</p>, ssr: false }
);

const MemoryMatchGame = dynamic(
  () => import("@/app/dashboard/_components/Games/MemoryMatchGame"),
  { loading: () => <p>Loading game...</p>, ssr: false }
);

const CrossWordGame = dynamic(
  () => import("@/app/dashboard/_components/Games/CrossWordGame"),
  { loading: () => <p>Loading game...</p>, ssr: false }
);

interface User {
  name: string | null;
  email: string;
  image: string | null;
}

// interface NoteTemplate {
//   id: string;
//   name: string;
//   description: string;
//   icon: string;
// }

interface QuizQuestion {
  question: string;
  answers: string[];
  correct_answer: string;
  difficulty: string;
}

interface GameInfo {
  gradient?: string; // Made optional since we're removing it
  textColor: string;
  gif: string;
  description: string;
  facts: string;
  difficulties: [string, string];
  knownFor: string;
}

const GAMES: Record<string, GameInfo> = {
  "Quick Quiz": {
    textColor: "text-white",
    gif: "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExZXV4aDYzZXhuNXA4bnNhMzdqNzlnY3I3bWJtenhreTExN2kyMmxvdiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/8zjxfpuutpJFRnlM2h/giphy.gif",
    description: "Rapid-fire questions.",
    facts: "Tests quick thinking.",
    difficulties: ["Simple", "Tough"],
    knownFor: "Speed & accuracy",
  },
  Hangman: {
    textColor: "text-white",
    gif: "https://media2.giphy.com/media/v1.Y2lkPTc5MGI3NjExN3ZmYTh6dDVsZGxuOXNtdmw4OXA5NXJ2aXM2bGMwdzJvamR3ZHZocSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/l0IxYKiysrhTdNkTS/giphy.gif",
    description: "Guess the word letter by letter.",
    facts: "Improves vocabulary.",
    difficulties: ["Easy", "Hard"],
    knownFor: "Addictive gameplay",
  },
  Millionaire: {
    textColor: "text-white",
    gif: "https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExcGY5c2l6OXVnem53bnpvN3UyMjNhNDJ4OXFvOHo0em9nc2VvemltaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/JOsFuMGjTxcMcSV3On/giphy.gif",
    description: "Answer trivia questions.",
    facts: "TV show format.",
    difficulties: ["Progressive", "Challenging"],
    knownFor: "Trivia & lifelines",
  },
  "Memory Match": {
    textColor: "text-white",
    gif: "https://media.giphy.com/media/xT5LMWNFkMJiPjaMve/giphy.gif",
    description: "Match pairs of cards.",
    facts: "Boosts memory skills.",
    difficulties: ["Easy", "Complex"],
    knownFor: "Fun recall challenge",
  },
  CrossWord: {
    textColor: "text-white",
    gif: "https://media4.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDZrYnZqdjkxMjF3MmppMW53cjFnOHV4dm9jNTIxNHUydGd6d2Y2ciZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/fVEdYhyl70a7otSHjj/giphy.gif",
    description: "Answer trivia questions.",
    facts: "Was Invented in 1990",
    difficulties: ["Find", "Challenging"],
    knownFor: "Trivia & lifelines",
  },
};

function GameCard({
  title,
  game,
  onClick,
}: {
  title: string;
  game: GameInfo;
  onClick: () => void;
}) {
  return (
    <div
      className="interactive-card bg-black/50 p-4 rounded-xl shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer border border-gray-700/50 backdrop-blur-md hover:border-gray-600/50"
      onClick={onClick}
    >
      {/* Image section with glass effect */}
      <div className="relative h-32 rounded-t-lg overflow-hidden">
        <Image
          src={game.gif}
          alt={`${title} GIF`}
          width={300}
          height={128}
          className="w-full h-full object-cover"
          loading="lazy" 
        />
        {title === "Millionaire" && (
          <div className="absolute top-2 left-2 bg-black/80 px-2 py-1 rounded-full text-xs text-white flex items-center gap-1">
            {"🔥 People's Favorite"}
          </div>
        )}
      </div>
      
      {/* Content section */}
      <div className="pt-3">
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-purple-200 text-xs mb-1">
          <span className="font-semibold text-yellow-400">Description:</span> {game.description}
        </p>
        <p className="text-purple-200 text-xs mb-1">
          <span className="font-semibold text-yellow-400">Facts:</span> {game.facts}
        </p>
        <p className="text-purple-200 text-xs mb-1">
          <span className="font-semibold text-yellow-400">Difficulties:</span>{" "}
          <span className="text-green-400">{game.difficulties[0]}</span> to{" "}
          <span className="text-red-400">{game.difficulties[1]}</span>
        </p>
        <p className="text-white text-xs">
          <span className="font-semibold text-yellow-400">Known For:</span> {game.knownFor}
        </p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [activeSection, setActiveSection] = useState<"active" | "game" | "note" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [hangmanQuiz, setHangmanQuiz] = useState<QuizQuestion[] | null>(null);
  const [millionaireQuiz, setMillionaireQuiz] = useState<QuizQuestion[] | null>(null);
  const [quickQuizData, setQuickQuizData] = useState<QuizQuestion[] | null>(null);
  const [memoryMatchQuiz, setMemoryMatchQuiz] = useState<QuizQuestion[] | null>(null);
  const [crossWordQuiz, setCrossWordQuiz] = useState<QuizQuestion[] | null>(null); // Added for CrossWord
  const router = useRouter();

  const fetchSession = useCallback(async () => {
    try {
      const profile = await getUserProfile();
      console.log("Fetched user from backend:", profile);
      setUser({
        name: profile.name ?? null,
        email: profile.email,
        image: profile.image ?? null,
      });
    } catch (err) {
      console.warn("Backend fetch failed, falling back to Clerk session");
  
      try {
        const response = await fetch("/api/auth/session", { cache: "no-store" });
        if (!response.ok) throw new Error("Session fetch failed");
        const data = await response.json();
        if (data.user) {
          setUser({
            name: data.user.name ?? null,
            email: data.user.email,
            image: data.user.image ?? null,
          });
        } else {
          router.push("/signin");
        }
      } catch (error) {
        console.error("Clerk session fallback failed:", error);
        router.push("/signin");
      }
    }
  }, [router]);
  
  
  // Add this useEffect to call fetchSession when component mounts
  useEffect(() => {
    fetchSession();
  }, [fetchSession]);
  
  // Game event listeners
  useEffect(() => {
    const handleLaunchHangman = (e: CustomEvent) => setHangmanQuiz(e.detail);
    const handleLaunchMillionaire = (e: CustomEvent) => setMillionaireQuiz(e.detail);
    const handleLaunchQuickQuiz = (e: CustomEvent) => setQuickQuizData(e.detail);
    const handleLaunchMemoryMatch = (e: CustomEvent) => setMemoryMatchQuiz(e.detail);
    const handleLaunchCrossWord = (e: CustomEvent) => setCrossWordQuiz(e.detail); // Added for CrossWord

    window.addEventListener("launchHangman", handleLaunchHangman as EventListener);
    window.addEventListener("launchMillionaire", handleLaunchMillionaire as EventListener);
    window.addEventListener("launchQuickQuiz", handleLaunchQuickQuiz as EventListener);
    window.addEventListener("launchMemoryMatch", handleLaunchMemoryMatch as EventListener);
    window.addEventListener("launchCrossWord", handleLaunchCrossWord as EventListener); // Added listener

    return () => {
      window.removeEventListener("launchHangman", handleLaunchHangman as EventListener);
      window.removeEventListener("launchMillionaire", handleLaunchMillionaire as EventListener);
      window.removeEventListener("launchQuickQuiz", handleLaunchQuickQuiz as EventListener);
      window.removeEventListener("launchMemoryMatch", handleLaunchMemoryMatch as EventListener);
      window.removeEventListener("launchCrossWord", handleLaunchCrossWord as EventListener); // Added cleanup
    };
  }, []);



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

        <div 
          className="card-hover p-3 sm:p-4 cursor-pointer transition-colors duration-200 hover:bg-purple-900"
          onClick={() => setActiveSection(activeSection === "note" ? null : "note")}
        >
          <div className="flex items-center gap-3 mb-2">
            <Book className="h-6 w-6 text-purple-500" />
            <h2 className="text-lg font-semibold text-[var(--foreground)]">Note Transformation</h2>
          </div>
          <p className="text-gray-400 text-xs">Convert your notes into interactive experiences.</p>
        </div>
      </div>

      {activeSection === "active" && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <GameCard
            title="Quick Quiz"
            game={GAMES["Quick Quiz"]}
            onClick={() => handleGameClick("Quick Quiz")}
          />
        </div>
      )}

      {activeSection === "game" && (
        <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {Object.entries(GAMES)
            .filter(([game]) => game !== "Quick Quiz")
            .map(([gameTitle, game]) => (
              <GameCard
                key={gameTitle}
                title={gameTitle}
                game={game}
                onClick={() => handleGameClick(gameTitle)}
              />
            ))}
        </div>
      )}

      {activeSection === "note" && (
        <div className="mt-6">
          <div className="bg-black/50 p-6 rounded-xl border border-gray-700/50 backdrop-blur-md">
            <h3 className="text-xl font-bold text-white mb-4">Transform Your Notes</h3>
            
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-2">
                <Upload className="h-5 w-5 text-purple-400" />
                <h4 className="text-lg font-semibold text-purple-200">Upload Your Notes</h4>
              </div>
              <div className="ml-8">
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-purple-500 transition-colors">
                  <FileText className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-300 mb-2">Drag & drop your files here</p>
                  <p className="text-gray-400 text-xs mb-3">Supported formats: PDF, DOCX, TXT, MD</p>
                  <button className="btn-secondary text-sm">Browse Files</button>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center gap-3 mb-3">
                <PenLine className="h-5 w-5 text-purple-400" />
                <h4 className="text-lg font-semibold text-purple-200">Or Write/Paste Your Content</h4>
              </div>
              <div className="ml-8">
                <textarea 
                  className="w-full h-32 bg-gray-800/70 border border-gray-700 rounded-lg p-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Type or paste your notes here..."
                ></textarea>
              </div>
            </div>

           

            <div className="flex justify-end">
              <button className="btn-primary flex items-center gap-2">
                Transform Now
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && selectedGame && (
        <GameModal gameTitle={selectedGame} onClose={() => setIsModalOpen(false)} />
      )}

      {hangmanQuiz && <Hangman quizData={hangmanQuiz} onClose={() => setHangmanQuiz(null)} />}
      {millionaireQuiz && <MillionaireGame quizData={millionaireQuiz} onClose={() => setMillionaireQuiz(null)} />}
      {quickQuizData && <QuickQuizGame quizData={quickQuizData} onClose={() => setQuickQuizData(null)} />}
      {memoryMatchQuiz && (
        <MemoryMatchGame quizData={memoryMatchQuiz} onClose={() => setMemoryMatchQuiz(null)} />
      )}
      {crossWordQuiz && <CrossWordGame quizData={crossWordQuiz} onClose={() => setCrossWordQuiz(null)} />}
      
      {/* Today's Challenge Section */}
      <div className="mt-10 mb-6">
        <h2 className="text-xl font-bold text-white mb-4"> Challenge for You</h2>
        <div className="bg-black/50 p-6 rounded-xl border border-gray-700/50 backdrop-blur-md">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-purple-200 mb-2">Coming Soon!</h3>
              <p className="text-gray-300 text-sm">
                Daily personalized challenges based on your learning patterns will appear here.
              </p>
            </div>
            <div className="bg-purple-800/40 p-3 rounded-lg">
              <div className="text-yellow-400 text-4xl">🏆</div>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-700/50">
            <p className="text-gray-400 text-xs">
              Stay tuned for personalized daily challenges that will help reinforce your learning
              and test your knowledge in fun, engaging ways.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}