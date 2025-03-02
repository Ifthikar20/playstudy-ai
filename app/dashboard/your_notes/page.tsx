"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Plus, Search, FileText, Trash2, Edit3, Play, Star, Filter, Grid, List } from "lucide-react";
import Link from "next/link";
import GameModal from "@/app/dashboard/_components/GameModal";
import Hangman from "@/app/dashboard/_components/Games/HangmanGame";

// Sample note data - using a memoized pattern to avoid recreation on each render
const useSampleNotes = () => {
  // This will only run once when the component first mounts
  const [sampleNotes] = useState([
    {
      id: "note1",
      title: "Ancient History - Roman Empire",
      content: "The Roman Empire was the post-Republican period of ancient Rome. As a polity, it included large territorial holdings around the Mediterranean Sea in Europe, North Africa, and Western Asia, ruled by emperors.",
      tags: ["history", "rome", "empire"],
      lastEdited: "2025-02-20T14:30:00",
      playCount: 5,
      starred: true,
    },
    {
      id: "note2",
      title: "Organic Chemistry - Alkanes",
      content: "Alkanes are saturated hydrocarbons with single bonds between carbon atoms. The general formula for an acyclic alkane is CnH2n+2. Each carbon atom is sp3-hybridized with tetrahedral geometry.",
      tags: ["chemistry", "organic", "alkanes"],
      lastEdited: "2025-02-22T09:15:00",
      playCount: 3,
      starred: false,
    },
    {
      id: "note3",
      title: "JavaScript Fundamentals",
      content: "JavaScript is a high-level, often just-in-time compiled programming language that conforms to the ECMAScript specification. JavaScript has curly-bracket syntax, dynamic typing, prototype-based object-orientation, and first-class functions.",
      tags: ["programming", "javascript", "web"],
      lastEdited: "2025-02-23T16:45:00",
      playCount: 7,
      starred: true,
    },
    {
      id: "note4",
      title: "Calculus - Integration Techniques",
      content: "Integration techniques include substitution, integration by parts, partial fractions, and trigonometric substitution. The substitution method converts a complex integral into a simpler form by changing variables.",
      tags: ["math", "calculus", "integration"],
      lastEdited: "2025-02-18T11:20:00",
      playCount: 2,
      starred: false,
    },
    {
      id: "note5",
      title: "Psychology - Memory Models",
      content: "Memory models describe how information is encoded, stored, and retrieved. The multistore model proposed by Atkinson and Shiffrin suggests that memory consists of three stores: sensory register, short-term memory, and long-term memory.",
      tags: ["psychology", "memory", "cognitive"],
      lastEdited: "2025-02-21T13:10:00",
      playCount: 4,
      starred: true,
    },
  ]);

  return sampleNotes;
};


interface QuizQuestion {
  question: string;
  answers: string[];
  correct_answer: string;
  difficulty: string;
}
type ViewMode = "grid" | "list";
type SortOption = "edited" | "played" | "title";

export default function YourNotes() {
  // Get memoized sample notes
  const sampleNotesData = useSampleNotes();
  const [notes, setNotes] = useState(sampleNotesData);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortOption>("edited");
  const [showFilters, setShowFilters] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [modalInitialContent, setModalInitialContent] = useState("");
  const [hangmanQuiz, setHangmanQuiz] = useState<QuizQuestion[] | null>(null);

  // Get all unique tags from notes - memoized to avoid recalculation on every render
  const allTags = useMemo(() => {
    return Array.from(new Set(notes.flatMap((note) => note.tags))).sort();
  }, [notes]);


  useEffect(() => {
    const handleLaunchHangman = (e: CustomEvent) => {
      setHangmanQuiz(e.detail);
    };
    window.addEventListener("launchHangman", handleLaunchHangman as EventListener);
    return () => window.removeEventListener("launchHangman", handleLaunchHangman as EventListener);
  }, []);

  // Filter and sort notes - memoized to avoid recalculation unless dependencies change
  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTags = selectedTags.length === 0 ||
          selectedTags.every(tag => note.tags.includes(tag));
        return matchesSearch && matchesTags;
      })
      .sort((a, b) => {
        switch (sortBy) {
          case "edited":
            return new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime();
          case "played":
            return b.playCount - a.playCount;
          case "title":
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      });
  }, [notes, searchTerm, selectedTags, sortBy]);

  const toggleStarNote = useCallback((id: string) => {
    setNotes(prevNotes =>
      prevNotes.map(note =>
        note.id === id ? { ...note, starred: !note.starred } : note
      )
    );
  }, []);

  const deleteNote = useCallback((id: string) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      setNotes(prevNotes => prevNotes.filter(note => note.id !== id));
    }
  }, []);

  // Open the game modal with the selected note content
  const handlePlayNote = useCallback((id: string) => {
    const noteToPlay = notes.find(note => note.id === id);
    if (noteToPlay) {
      setSelectedNote(id);
      setSelectedGame("Quick Quiz");
      setModalInitialContent(noteToPlay.content);
      setIsModalOpen(true);

      // Update play count
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === id ? { ...note, playCount: note.playCount + 1 } : note
        )
      );
    }
  }, [notes]);

  // Open the "Create New Note" modal
  const handleCreateNewNote = useCallback(() => {
    setSelectedNote(null);
    setSelectedGame("Create New Note");
    setModalInitialContent("");
    setIsModalOpen(true);
  }, []);

  // Save content from modal to a new or existing note
  const handleSaveToNote = useCallback((content: string) => {
    if (!content.trim()) return;

    // Extract title from first line or use default
    const lines = content.split('\n');
    let title = "Untitled Note";

    if (lines.length > 0) {
      const firstLine = lines[0].trim();
      // Check if it's a markdown header
      if (firstLine.startsWith('#')) {
        title = firstLine.replace(/^#+\s+/, '').trim();
      } else if (firstLine.length > 0 && firstLine.length < 60) {
        // Or just use the first line if it's reasonably short
        title = firstLine;
      }
    }

    if (selectedNote) {
      // Update existing note
      setNotes(prevNotes =>
        prevNotes.map(note =>
          note.id === selectedNote
            ? {
              ...note,
              content: content,
              title: title,
              lastEdited: new Date().toISOString()
            }
            : note
        )
      );
    } else {
      // Create new note
      const newNote = {
        id: `note${Date.now()}`,
        title: title,
        content: content,
        tags: [],
        lastEdited: new Date().toISOString(),
        playCount: 0,
        starred: false,
      };

      setNotes(prevNotes => [...prevNotes, newNote]);
    }

    setIsModalOpen(false);
  }, [selectedNote]);

  const toggleTag = useCallback((tag: string) => {
    setSelectedTags(prevTags =>
      prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    );
  }, []);

  // Format date to relative time - memoized to avoid recreating on every render
  const formatRelativeDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'just now';

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes} ${diffInMinutes === 1 ? 'minute' : 'minutes'} ago`;

    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours} ${diffInHours === 1 ? 'hour' : 'hours'} ago`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 30) return `${diffInDays} ${diffInDays === 1 ? 'day' : 'days'} ago`;

    const diffInMonths = Math.floor(diffInDays / 30);
    return `${diffInMonths} ${diffInMonths === 1 ? 'month' : 'months'} ago`;
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">
          Your Notes
        </h1>
        <button
          onClick={handleCreateNewNote}
          className="btn-primary flex items-center gap-2 self-start"
        >
          <Plus className="h-4 w-4" />
          <span>New Note</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="card-hover p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 border border-gray-700 rounded-lg py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-gray-800 border border-gray-700 rounded-lg p-2 hover:bg-gray-700 transition-colors"
              title="Filter"
            >
              <Filter className="h-5 w-5 text-gray-400" />
            </button>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-gray-800 border border-gray-700 rounded-lg p-2 hover:bg-gray-700 transition-colors text-gray-400"
            >
              <option value="edited">Last Edited</option>
              <option value="played">Most Played</option>
              <option value="title">Title (A-Z)</option>
            </select>
            <button
              onClick={() => setViewMode("grid")}
              className={`bg-gray-800 border border-gray-700 rounded-lg p-2 hover:bg-gray-700 transition-colors ${viewMode === "grid" ? "border-purple-500" : ""}`}
              title="Grid View"
            >
              <Grid className={`h-5 w-5 ${viewMode === "grid" ? "text-purple-400" : "text-gray-400"}`} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`bg-gray-800 border border-gray-700 rounded-lg p-2 hover:bg-gray-700 transition-colors ${viewMode === "list" ? "border-purple-500" : ""}`}
              title="List View"
            >
              <List className={`h-5 w-5 ${viewMode === "list" ? "text-purple-400" : "text-gray-400"}`} />
            </button>
          </div>
        </div>

        {/* Tag Filters */}
        {showFilters && (
          <div className="mt-4">
            <h3 className="text-sm font-medium text-gray-300 mb-2">Filter by Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-full text-xs ${selectedTags.includes(tag)
                      ? "bg-purple-600 text-white"
                      : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                    }`}
                >
                  {tag}
                </button>
              ))}
              {selectedTags.length > 0 && (
                <button
                  onClick={() => setSelectedTags([])}
                  className="px-3 py-1 rounded-full text-xs bg-gray-700 text-gray-300 hover:bg-gray-600"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Notes Grid or List */}
      {filteredNotes.length === 0 ? (
        <div className="text-center py-12 card-hover">
          <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400">No notes found matching your criteria.</p>
          <button
            onClick={() => {
              setSearchTerm("");
              setSelectedTags([]);
            }}
            className="mt-4 text-purple-400 hover:text-purple-300"
          >
            Clear filters
          </button>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredNotes.map((note) => (
            <div key={note.id} className="card-hover relative p-4 group">
              <div className="flex justify-between items-start mb-2">
                <h2 className="text-lg font-medium pr-6 truncate">{note.title}</h2>
                <button
                  onClick={() => toggleStarNote(note.id)}
                  className="absolute top-4 right-4"
                >
                  <Star
                    className={`h-5 w-5 ${note.starred ? "text-yellow-400 fill-yellow-400" : "text-gray-500"
                      }`}
                  />
                </button>
              </div>
              <p className="text-gray-400 text-sm mb-3 line-clamp-3">{note.content}</p>
              <div className="flex flex-wrap gap-1 mb-3">
                {note.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 bg-gray-700 rounded-full text-gray-300 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>Edited {formatRelativeDate(note.lastEdited)}</span>
                <span>Played {note.playCount} times</span>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-gray-800 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={() => handlePlayNote(note.id)}
                  className="p-2 bg-purple-600 rounded-full hover:bg-purple-500"
                  title="Play"
                >
                  <Play className="h-4 w-4 text-white" />
                </button>
                <Link href={`/dashboard/your_notes/${note.id}`}>
                  <button
                    className="p-2 bg-blue-600 rounded-full hover:bg-blue-500"
                    title="Edit"
                  >
                    <Edit3 className="h-4 w-4 text-white" />
                  </button>
                </Link>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="p-2 bg-red-600 rounded-full hover:bg-red-500"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredNotes.map((note) => (
            <div key={note.id} className="card-hover p-4 flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="flex items-start gap-2 mb-1">
                  <h2 className="text-lg font-medium">{note.title}</h2>
                  {note.starred && (
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                  )}
                </div>
                <p className="text-gray-400 text-sm mb-2 line-clamp-2">{note.content}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {note.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 bg-gray-700 rounded-full text-gray-300 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4 text-xs text-gray-400">
                  <span>Edited {formatRelativeDate(note.lastEdited)}</span>
                  <span>Played {note.playCount} times</span>
                </div>
              </div>
              <div className="flex flex-col gap-2 justify-center">
                <button
                  onClick={() => handlePlayNote(note.id)}
                  className="p-2 bg-purple-600 rounded-lg hover:bg-purple-500 flex items-center gap-1"
                  title="Play"
                >
                  <Play className="h-4 w-4 text-white" />
                  <span className="text-xs text-white">Play</span>
                </button>
                <div className="flex gap-2">
                  <Link href={`/dashboard/your_notes/${note.id}`}>
                    <button
                      className="p-2 bg-blue-600 rounded-lg hover:bg-blue-500"
                      title="Edit"
                    >
                      <Edit3 className="h-4 w-4 text-white" />
                    </button>
                  </Link>
                  <button
                    onClick={() => toggleStarNote(note.id)}
                    className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                    title={note.starred ? "Unstar" : "Star"}
                  >
                    <Star
                      className={`h-4 w-4 ${note.starred ? "text-yellow-400 fill-yellow-400" : "text-gray-400"
                        }`}
                    />
                  </button>
                  <button
                    onClick={() => deleteNote(note.id)}
                    className="p-2 bg-red-600 rounded-lg hover:bg-red-500"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {/* Game Modal - Used for both notes and games */}
      {isModalOpen && selectedGame && (
        <GameModal
          gameTitle={selectedGame}
          onClose={() => setIsModalOpen(false)}
          onSaveToNote={handleSaveToNote}
          initialContent={modalInitialContent}
        />
      )}

      {/* Hangman Game */}
      {hangmanQuiz && <Hangman quizData={hangmanQuiz} onClose={() => setHangmanQuiz(null)} />}
    </div>
  );
}