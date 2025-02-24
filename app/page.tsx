"use client";

import { useState, useEffect } from 'react';
import { Gamepad, Book, Brain, ArrowRight, Menu, X, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';

type HoveredCard = 'active' | 'game' | 'note' | null;

export default function Page() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<HoveredCard>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Set your desired password here
  const CORRECT_PASSWORD = "PlayStudy2025";

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY + window.scrollY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
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

  // Show password prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4 text-center">
            Enter Password
          </h2>
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password..."
              className="w-full p-3 bg-gray-700 rounded-lg text-white outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="w-full px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors text-white font-semibold"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Main content (only shown after authentication)
  return (
    <div className="min-h-screen bg-gray-900 text-white relative">
      {/* Cursor Glow Effect */}
      <div
        className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
        style={{
          background: `
            radial-gradient(100px at ${mousePosition.x}px ${mousePosition.y}px, rgba(139, 92, 246, 0.3), transparent 50%),
            radial-gradient(200px at ${mousePosition.x}px ${mousePosition.y}px, rgba(168, 85, 247, 0.15), transparent 50%)
          `
        }}
      />

      {/* Navigation */}
      <nav className="border-b border-gray-800 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Gamepad className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />
              <span className="ml-2 text-lg sm:text-xl font-bold">PlayStudy.AI</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <Link
                href="/signin"
                className="px-4 py-2 rounded-lg text-gray-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link href="/signin">
                <button className="px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
                  Try Free
                </button>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ?
                <X className="h-6 w-6 text-gray-300" /> :
                <Menu className="h-6 w-6 text-gray-300" />
              }
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 inset-x-0 bg-gray-900 border-b border-gray-800 z-50">
            <div className="px-4 py-4 space-y-3">
              <Link
                href="/signin"
                className="block w-full px-4 py-2 rounded-lg text-gray-300 hover:text-white transition-colors text-left"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/signin"
                className="block w-full px-4 py-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors text-left"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Try Free
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent px-4">
              Why Study When You Can PlayStudy?
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-400 mb-6 sm:mb-8 max-w-xl sm:max-w-2xl mx-auto px-4">
              Transform your boring notes into exciting games. Learn faster, remember longer, and actually enjoy studying.
            </p>
            <Link href="/signin">
              <button className="px-6 sm:px-8 py-3 sm:py-4 bg-purple-600 rounded-xl text-base sm:text-lg font-semibold hover:bg-purple-700 transition-all transform hover:scale-105 flex items-center mx-auto">
                  start Playing/Studying
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </button>
            </Link>
          </div>
        </div>

        {/* Animated GIF Section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="relative w-full aspect-video max-w-3xl mx-auto rounded-2xl overflow-hidden">
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl opacity-75 blur-2xl animate-pulse"></div>
            <div className="relative rounded-xl overflow-hidden border-2 border-purple-500/50 bg-gray-900">
              <div className="relative w-full aspect-video">
              </div>
            </div>
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-purple-500/10 rounded-full filter blur-xl animate-pulse"></div>
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-pink-500/10 rounded-full filter blur-xl animate-pulse delay-75"></div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Active Learning Card */}
            <div
              className="relative bg-gray-800 p-4 sm:p-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:bg-gray-750 overflow-hidden group"
              onMouseEnter={() => setHoveredCard('active')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative z-10">
                <div className="bg-purple-500/10 p-3 rounded-lg w-fit mb-4 group-hover:animate-bounce">
                  <Brain className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500 transform transition-transform group-hover:rotate-12" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Active Learning</h3>
                <p className="text-sm sm:text-base text-gray-400">
                  Engage with your study material through interactive games and quizzes
                </p>
              </div>
              {hoveredCard === 'active' && (
                <div className="absolute inset-0 z-0">
                  {[...Array(3)].map((_, i) => (
                    <Sparkles
                      key={i}
                      className="absolute text-purple-500/20 animate-pulse"
                      style={{
                        top: `${Math.random() * 100}%`,
                        left: `${Math.random() * 100}%`,
                        animation: `pulse ${1 + i * 0.5}s infinite`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Game-Based Learning Card */}
            <div
              className="relative bg-gray-800 p-4 sm:p-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:bg-gray-750 overflow-hidden group"
              onMouseEnter={() => setHoveredCard('game')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative z-10">
                <div className="bg-purple-500/10 p-3 rounded-lg w-fit mb-4">
                  <Gamepad className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500 transform transition-transform group-hover:rotate-12" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Game-Based Learning</h3>
                <p className="text-sm sm:text-base text-gray-400">
                  Turn any subject into an engaging game with our AI-powered conversion
                </p>
              </div>
              {hoveredCard === 'game' && (
                <div className="absolute inset-0 z-0">
                  <div className="absolute w-16 h-16 bg-purple-500/20 rounded-full -top-8 -left-8 animate-ping" />
                  <div className="absolute w-12 h-12 bg-pink-500/20 rounded-full -bottom-6 -right-6 animate-ping delay-100" />
                </div>
              )}
            </div>

            {/* Note Transformation Card */}
            <div
              className="relative bg-gray-800 p-4 sm:p-6 rounded-xl transition-all duration-300 transform hover:scale-105 hover:bg-gray-750 overflow-hidden group sm:col-span-2 lg:col-span-1"
              onMouseEnter={() => setHoveredCard('note')}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className="relative z-10">
                <div className="bg-purple-500/10 p-3 rounded-lg w-fit mb-4">
                  <Book className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500 transform transition-transform group-hover:scale-110" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2">Note Transformation</h3>
                <p className="text-sm sm:text-base text-gray-400">
                  Upload your notes and watch them transform into interactive learning experiences
                </p>
              </div>
              {hoveredCard === 'note' && (
                <div className="absolute inset-0 z-0">
                  {[...Array(3)].map((_, i) => (
                    <Zap
                      key={i}
                      className="absolute text-purple-500/20 animate-bounce"
                      style={{
                        top: `${20 + i * 30}%`,
                        left: `${20 + i * 30}%`,
                        animationDelay: `${i * 0.2}s`
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Floating Background Elements */}
        <div className="absolute top-20 sm:top-40 left-0 sm:left-10 w-48 sm:w-72 h-48 sm:h-72 bg-purple-500/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-0 sm:right-10 w-64 sm:w-96 h-64 sm:h-96 bg-pink-500/10 rounded-full filter blur-3xl"></div>
      </div>
    </div>
  );
}