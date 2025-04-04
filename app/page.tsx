"use client";

import { useState, useEffect } from 'react';
import { Gamepad, Book, Brain, ArrowRight, Menu, X, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';
import GameModal from '@/app/dashboard/_components/GameModal';
import Image from 'next/image';

type HoveredCard = 'active' | 'game' | 'note' | null;

export default function Page() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<HoveredCard>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeSection, setActiveSection] = useState<"active" | "game" | "note" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [isLoginPromptOpen, setIsLoginPromptOpen] = useState(false);

  const CORRECT_PASSWORD = "PlayStudy2025";

  // Sample student feedback data
  const studentFeedback = [
    {
      name: "Sheryl Berge",
      university: "MIT",
      major: "Physics",
      quote: "I can focus on understanding concepts, not just jotting down notes. It's like having a personal study assistant.",
      interestedFeature: "Concept Maps"
    },
    {
      name: "Yash Sharma",
      university: "Duke University",
      major: "Public Policy",
      quote: "The flashcards created are tailored to my learning style. It's like the AI knows exactly what I need to study.",
      interestedFeature: "Smart Flashcards"
    },
    {
      name: "Kiehn Po",
      university: "Princeton University",
      major: "Computer Science",
      quote: "Love how it generates quizzes from my lectures. Makes revising so much more efficient and less stressful.",
      interestedFeature: "Quiz Generator"
    },
    {
      name: "Presley Burghardt",
      university: "Stanford University",
      major: "Premed",
      quote: "It turns my YouTube binges into productive study sessions. It's a game-changer.",
      interestedFeature: "Video Summarizer"
    },
    {
      name: "Peter Reynolds",
      university: "Columbia University",
      major: "Political Science",
      quote: "I love how it can take an article and break it into bite-sized materials. Reading academic articles feels less daunting now.",
      interestedFeature: "Article Breakdown"
    },
    {
      name: "Rithik Duvva",
      university: "Duke University",
      major: "Economics",
      quote: "I feel like I'm studying smarter, not harder. It's a boon for anyone who values efficiency.",
      interestedFeature: "Study Optimization"
    }
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY + window.scrollY });
    };
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === CORRECT_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert("Incorrect password. Please try again.");
      setPassword('');
    }
  };

  const handleSectionClick = (section: "active" | "game" | "note") => {
    setActiveSection(activeSection === section ? null : section);
    setIsLoginPromptOpen(true);
  };

  const handleGameClick = () => {
    setIsLoginPromptOpen(true);
  };

  const closeLoginPrompt = () => {
    setIsLoginPromptOpen(false);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedGame(null);
  };

  const NOTE_TRANSFORMATION_GAME = {
    "Note Transformer": {
      gradient: "from-purple-900 via-purple-800 to-purple-700",
      textColor: "text-purple-100",
      gif: "https://media.giphy.com/media/26FPyQsENxP6P0AOk/giphy.gif",
      description: "Convert your notes into wild games.",
      facts: "Retention through chaos and fun.",
      difficulties: ["Easy", "Medium"],
      knownFor: "Mind-bending note conversion",
    },
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[var(--background)] flex items-center justify-center">
        <div className="bg-gray-800/80 p-6 rounded-xl shadow-lg w-full max-w-md border border-purple-500/20 animate-fade-in">
          <h2 className="text-2xl font-bold text-[var(--foreground)] mb-4 text-center text-purple-500">
            Enter the Vault
          </h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter the secret..."
              className="w-full p-3 bg-gray-700/50 rounded-lg text-[var(--foreground)] outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder-gray-500"
            />
            <button
              type="submit"
              className="btn-primary w-full transition-all transform hover:scale-105"
            >
              Unlock
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] relative overflow-hidden">
      {/* Dynamic Background Effects - Updated to pure purple */}
      <div
        className="pointer-events-none fixed inset-0 z-10 transition-opacity duration-500"
        style={{
          background: `
            radial-gradient(150px at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.3), transparent 60%),
            radial-gradient(300px at ${mousePosition.x}px ${mousePosition.y}px, rgba(124, 58, 237, 0.15), transparent 60%)
          `,
          opacity: 1 - scrollY / 500,
        }}
      />

      {/* Scroll Down Indicator */}
      <div className="fixed bottom-10 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <ArrowRight className="h-6 w-6 text-purple-500 rotate-90" />
      </div>

      {/* Login Prompt Modal */}
      {isLoginPromptOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-gray-800/90 p-6 rounded-xl shadow-lg w-full max-w-sm border border-purple-500/30">
            <h2 className="text-xl font-bold text-[var(--foreground)] mb-4 text-center text-purple-500">
              Login Required
            </h2>
            <p className="text-gray-300 mb-6 text-center">
              Please log in to play and unleash the full experience!
            </p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={closeLoginPrompt}
                className="px-4 py-2 bg-gray-700 rounded-lg text-gray-300 hover:bg-gray-600 transition-all"
              >
                Cancel
              </button>
              <Link href="/signin">
                <button
                  onClick={closeLoginPrompt}
                  className="btn-primary px-4 py-2 transition-all transform hover:scale-105"
                >
                  Log In
                </button>
              </Link>
            </div>
          </div>
        </div>
      )}

<nav className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center">
              <Gamepad className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
              <span className="ml-2 text-lg sm:text-xl font-bold">PlayStudy.AI</span>
            </Link>
          </div>
        </div>
      </nav>
{/* 
      <nav className="header fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Gamepad className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500 animate-pulse" />
              <span className="ml-2 text-lg sm:text-xl font-bold text-purple-500">
                PlayStudy.AI
              </span>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <Link href="/signin" className="header-link px-4 py-2 rounded-lg transition-all">
                Sign In
              </Link>
              <Link href="/signin">
                <button className="btn-primary hover:shadow-purple-600/50 transition-all transform hover:scale-105">
                  Try Free
                </button>
              </Link>
            </div>
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6 text-gray-300" /> : <Menu className="h-6 w-6 text-gray-300" />}
            </button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 inset-x-0 bg-gray-800/95 border-b border-gray-700 z-50 animate-slide-down">
            <div className="px-4 py-4 space-y-3">
              <Link
                href="/signin"
                className="header-link block w-full px-4 py-2 rounded-lg transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/signin"
                className="btn-primary block w-full transition-all"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Try Free
              </Link>
            </div>
          </div>
        )}
      </nav> */}

      <div className="relative pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="text-center relative">
          <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Why Study When You Can PlayStudy?
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-300 mb-6 sm:mb-8 max-w-xl sm:max-w-2xl mx-auto px-4 animate-fade-in-up delay-200">
              Turn boring notes into electrifying games. Learn fast, retain more, enjoy the chaos.
            </p>
            <Link href="/signin">
              <button className="btn-primary px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold hover:shadow-purple-600/50 transition-all transform hover:scale-105 flex items-center mx-auto animate-pulse-slow">
                Start Playing
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5 animate-bounce-right" />
              </button>
            </Link>
          </div>
        </div>

        {/* Main Screen GIF */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative">
          <div className="relative w-full aspect-video max-w-3xl mx-auto rounded-2xl overflow-hidden animate-slide-up translate-y-[-10px]">
            <div className="absolute -inset-4 bg-purple-600 opacity-50 blur-3xl animate-pulse-slow"></div>
            <div className="card-hover relative rounded-xl overflow-hidden border-2 border-purple-500/50">
              <Image
                src="/demo-animation2.gif"
                alt="PlayStudy Demo Animation"
                width={1280}
                height={720}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div
              className="card-hover relative p-4 sm:p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-purple-600/30 overflow-hidden group cursor-pointer animate-slide-up delay-100"
              onMouseEnter={() => setHoveredCard('active')}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleSectionClick("active")}
            >
              <div className="relative z-10">
                <div className="bg-purple-500/20 p-3 rounded-lg w-fit mb-4 group-hover:animate-spin-slow">
                  <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500 transform transition-transform group-hover:scale-125" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-purple-500">Active Learning</h3>
                <p className="text-sm sm:text-base text-gray-300">
                  Engage with electrified games and quizzes.
                </p>
              </div>
              {hoveredCard === 'active' && (
                <div className="absolute inset-0 z-0">
                  {[...Array(5)].map((_, i) => (
                    <Sparkles
                      key={i}
                      className="absolute text-purple-500/40 animate-twinkle"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animationDuration: `${1 + i * 0.3}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            <div
              className="card-hover relative p-4 sm:p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-purple-600/30 overflow-hidden group cursor-pointer animate-slide-up delay-200"
              onMouseEnter={() => setHoveredCard('game')}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleSectionClick("game")}
            >
              <div className="relative z-10">
                <div className="bg-purple-500/20 p-3 rounded-lg w-fit mb-4">
                  <Gamepad className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500 transform transition-transform group-hover:rotate-12" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-purple-500">Game-Based Learning</h3>
                <p className="text-sm sm:text-base text-gray-300">
                  Transform subjects into thrilling games.
                </p>
              </div>
              {hoveredCard === 'game' && (
                <div className="absolute inset-0 z-0">
                  <div className="absolute w-20 h-20 bg-purple-500/30 rounded-full -top-10 -left-10 animate-ping" />
                  <div className="absolute w-16 h-16 bg-purple-600/30 rounded-full -bottom-8 -right-8 animate-ping delay-150" />
                </div>
              )}
            </div>

            <div
              className="card-hover relative p-4 sm:p-6 transition-all duration-300 transform hover:scale-105 hover:shadow-purple-600/30 overflow-hidden group sm:col-span-2 lg:col-span-1 cursor-pointer animate-slide-up delay-300"
              onMouseEnter={() => setHoveredCard('note')}
              onMouseLeave={() => setHoveredCard(null)}
              onClick={() => handleSectionClick("note")}
            >
              <div className="relative z-10">
                <div className="bg-purple-500/20 p-3 rounded-lg w-fit mb-4">
                  <Book className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500 transform transition-transform group-hover:scale-110" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-purple-500">Note Transformation</h3>
                <p className="text-sm sm:text-base text-gray-300">
                  Notes into interactive chaos.
                </p>
              </div>
              {hoveredCard === 'note' && (
                <div className="absolute inset-0 z-0">
                  {[...Array(4)].map((_, i) => (
                    <Zap
                      key={i}
                      className="absolute text-purple-500/40 animate-bounce"
                      style={{
                        top: `${20 + i * 25}%`,
                        left: `${20 + i * 25}%`,
                        animationDelay: `${i * 0.15}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Active Learning Section */}
          {activeSection === "active" && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
              <div
                className="card-hover interactive-card bg-gradient-to-br from-purple-900 via-purple-800 to-purple-700 p-3 sm:p-4 transform hover:scale-105 hover:shadow-purple-600/40 transition-all duration-300 cursor-pointer"
                onClick={handleGameClick}
              >
                <Image
                  src="https://media.giphy.com/media/26FPyQsENxP6P0AOk/giphy.gif"
                  alt="Quick Quiz GIF"
                  width={300}
                  height={128}
                  className="w-full h-32 object-cover rounded-t-lg mb-3 border border-purple-500/50"
                  loading="lazy"
                />
                <h3 className="text-lg font-bold text-[var(--foreground)] mb-2 text-purple-300">Quick Quiz</h3>
                <p className="text-purple-100 text-xs mb-1">
                  <span className="font-semibold text-purple-300">Description:</span> Rapid-fire madness.
                </p>
                <p className="text-purple-100 text-xs mb-1">
                  <span className="font-semibold text-purple-300">Facts:</span> Sharpens your wits.
                </p>
                <p className="text-purple-100 text-xs mb-1">
                  <span className="font-semibold text-purple-300">Difficulties:</span>{" "}
                  <span className="text-green-400">Simple</span> to <span className="text-purple-300">Brutal</span>
                </p>
                <p className="text-purple-100 text-xs">
                  <span className="font-semibold text-purple-300">Known For:</span> Speed & chaos
                </p>
              </div>
            </div>
          )}

          {/* Game-Based Learning Section */}
          {activeSection === "game" && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
              {Object.entries({
                Hangman: {
                  gradient: "from-purple-900 via-purple-800 to-purple-700",
                  textColor: "text-purple-100",
                  gif: "https://media.giphy.com/media/l0MYt5jPRARvPnq92/giphy.gif",
                  description: "Guess or perish.",
                  facts: "Vocabulary blast.",
                  difficulties: ["Easy", "Hard"],
                  knownFor: "Edge-of-seat fun",
                },
                Millionaire: {
                  gradient: "from-purple-900 via-purple-800 to-purple-700",
                  textColor: "text-purple-100",
                  gif: "https://media.giphy.com/media/3o6Zt6ML6BicZ3gL6M/giphy.gif",
                  description: "Trivia for glory.",
                  facts: "Game show vibes.",
                  difficulties: ["Progressive", "Insane"],
                  knownFor: "Lifeline drama",
                },
                "Memory Match": {
                  gradient: "from-purple-900 via-purple-800 to-purple-700",
                  textColor: "text-purple-100",
                  gif: "https://media.giphy.com/media/xT5LMWNFkMJiPjaMve/giphy.gif",
                  description: "Match or lose it.",
                  facts: "Memory overload.",
                  difficulties: ["Easy", "Chaos"],
                  knownFor: "Flippin' fun",
                },
              }).map(([gameTitle, game]) => (
                <div
                  key={gameTitle}
                  className={`card-hover interactive-card bg-gradient-to-br ${game.gradient} p-3 sm:p-4 transform hover:scale-105 transition-all duration-300 cursor-pointer`}
                  onClick={handleGameClick}
                >
                  <Image
                    src={game.gif}
                    alt={`${gameTitle} GIF`}
                    width={300}
                    height={128}
                    className="w-full h-32 object-cover rounded-t-lg mb-3 border border-purple-500/50"
                    loading="lazy"
                  />
                  <h3 className="text-lg font-bold text-[var(--foreground)] mb-2 text-purple-300">{gameTitle}</h3>
                  <p className={`${game.textColor} text-xs mb-1`}>
                    <span className="font-semibold text-purple-300">Description:</span> {game.description}
                  </p>
                  <p className={`${game.textColor} text-xs mb-1`}>
                    <span className="font-semibold text-purple-300">Facts:</span> {game.facts}
                  </p>
                  <p className={`${game.textColor} text-xs mb-1`}>
                    <span className="font-semibold text-purple-300">Difficulties:</span>{" "}
                    <span className="text-green-400">{game.difficulties[0]}</span> to{" "}
                    <span className="text-purple-300">{game.difficulties[1]}</span>
                  </p>
                  <p className={`${game.textColor} text-xs`}>
                    <span className="font-semibold text-purple-300">Known For:</span> {game.knownFor}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Note Transformation Section */}
          {activeSection === "note" && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 animate-fade-in">
              {Object.entries(NOTE_TRANSFORMATION_GAME).map(([gameTitle, game]) => (
                <div
                  key={gameTitle}
                  className={`card-hover interactive-card bg-gradient-to-br ${game.gradient} p-3 sm:p-4 transform hover:scale-105 transition-all duration-300 cursor-pointer`}
                  onClick={handleGameClick}
                >
                  <Image
                    src={game.gif}
                    alt={`${gameTitle} GIF`}
                    width={300}
                    height={128}
                    className="w-full h-32 object-cover rounded-t-lg mb-3 border border-purple-500/50"
                    loading="lazy"
                  />
                  <h3 className="text-lg font-bold text-[var(--foreground)] mb-2 text-purple-300">{gameTitle}</h3>
                  <p className={`${game.textColor} text-xs mb-1`}>
                    <span className="font-semibold text-purple-300">Description:</span> {game.description}
                  </p>
                  <p className={`${game.textColor} text-xs mb-1`}>
                    <span className="font-semibold text-purple-300">Facts:</span> {game.facts}
                  </p>
                  <p className={`${game.textColor} text-xs mb-1`}>
                    <span className="font-semibold text-purple-300">Difficulties:</span>{" "}
                    <span className="text-green-400">{game.difficulties[0]}</span> to{" "}
                    <span className="text-purple-300">{game.difficulties[1]}</span>
                  </p>
                  <p className={`${game.textColor} text-xs`}>
                    <span className="font-semibold text-purple-300">Known For:</span> {game.knownFor}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* GameModal */}
          {isModalOpen && selectedGame && (
            <GameModal gameTitle={selectedGame} onClose={closeModal} />
          )}

          <br />
          <br /><br />


          {/* Wall of Players Section */}
          <div className="mt-16 mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 text-purple-400">
              Trusted by Top University Students
            </h2>

            {/* Testimonial grid with interested features */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-4">
              {studentFeedback.map((student, index) => (
                <div
                  key={index}
                  className="bg-gray-800 p-6 rounded-xl border border-purple-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 hover:translate-y-[-4px]"
                >
                  {/* Feature badge */}
                  <div className="mb-4">
                    <span className="bg-purple-500/20 text-purple-300 text-xs px-3 py-1 rounded-full font-medium">
                      {student.interestedFeature}
                    </span>
                  </div>

                  <blockquote className="text-gray-300 text-sm leading-relaxed mb-5 border-l-2 border-purple-500/30 pl-4 italic">
                    "{student.quote}"
                  </blockquote>

                  <div className="mt-4 pt-3 border-t border-gray-700">
                    <p className="font-semibold text-white">{student.name}</p>
                    <p className="text-sm text-purple-300">{student.major} Major</p>
                    <p className="text-xs text-gray-400">{student.university}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>


          {/* Footer */}
          <footer className="bg-black text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Our Mission */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-purple-500">
                    Our Mission
                  </h3>
                  <p className="text-sm">
                    At PlayStudy.AI, {"we're"} on a quest to revolutionize learning by turning mundane study sessions into electrifying game experiences. We believe education should spark joy, ignite curiosity, and stick with you—because why just study when you can play?
                  </p>
                </div>

                {/* Policy and Conduct */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-purple-500">
                    Policy and Conduct
                  </h3>
                  <p className="text-sm">
                    {"We're"} committed to creating a fun, fair, and respectful community. Our policies ensure a safe space for all players—{"cheating's"} out, {"creativity's"} in. Check out our full guidelines for the rules of the game.
                  </p>
                  <Link href="/policy" className="text-purple-400 hover:text-purple-300 text-sm mt-2 inline-block transition-colors">
                    Read More
                  </Link>
                </div>

                {/* Learn About Refund */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-purple-500">
                    Learn About Refund
                  </h3>
                  <p className="text-sm">
                    Changed your mind? {"We've"} got you covered with a straightforward refund process. Dive into the details to see how we keep things hassle-free and player-friendly.
                  </p>
                  <Link href="/refunds" className="text-purple-400 hover:text-purple-300 text-sm mt-2 inline-block transition-colors">
                    Learn More
                  </Link>
                </div>
              </div>
              <div className="mt-8 text-center text-sm text-gray-400">
                © 2025 PlayStudy.AI. All rights reserved.
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  <Link href="/policy" className="text-purple-400 hover:text-purple-300 text-sm transition-colors">
                    Policy and Conduct
                  </Link>
                  <Link href="/terms" className="text-purple-400 hover:text-purple-300 text-sm transition-colors">
                    Terms of Service
                  </Link>
                  <Link href="/contact" className="text-purple-400 hover:text-purple-300 text-sm transition-colors">
                    Contact Us
                  </Link>
                </div>
              </div>
            </div>
          </footer>



        </div>

        <div className="absolute top-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full filter blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full filter blur-3xl animate-pulse delay-300"></div>
      </div>
    </div>
  );
}