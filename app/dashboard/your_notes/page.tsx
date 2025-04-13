"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, Trash2, Edit3 } from "lucide-react";
import {
  getUserNotes,
  createNote,
  updateNote,
  deleteNote,
  Note,
} from '@/lib/api-client';

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchNotes = useCallback(async () => {
    try {
      setLoading(true);
      const fetchedNotes = await getUserNotes();
      setNotes(fetchedNotes);
    } catch (err) {
      console.error("Failed to fetch notes", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleSaveNote = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;

    try {
      setLoading(true);
      if (editingNote) {
        const updated = await updateNote(editingNote.id, newTitle, newContent);
        setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
        setEditingNote(null);
      } else {
        const created = await createNote(newTitle, newContent);
        setNotes((prev) => [...prev, created]);
      }
      setNewTitle("");
      setNewContent("");
    } catch (err) {
      console.error("Failed to save note", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteNote = async (id: string) => {
    try {
      setLoading(true);
      await deleteNote(id);
      setNotes((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("Failed to delete note", err);
    } finally {
      setLoading(false);
    }
  };

  const startEditing = (note: Note) => {
    setEditingNote(note);
    setNewTitle(note.title);
    setNewContent(note.content);
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-bold text-white mb-6">Your Notes</h1>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          className="w-full mb-2 p-2 rounded bg-gray-800 text-white border border-gray-700"
        />
        <textarea
          placeholder="Content"
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          className="w-full h-32 p-2 rounded bg-gray-800 text-white border border-gray-700 mb-2"
        />
        <button
          onClick={handleSaveNote}
          className="btn-primary flex items-center gap-2"
          disabled={loading}
        >
          <Plus className="h-4 w-4" />
          {editingNote ? "Update Note" : "Create Note"}
        </button>
      </div>

      {loading && <p className="text-gray-400 mb-4">Loading...</p>}

      <ul className="space-y-4">
        {notes.map((note) => (
          <li key={note.id} className="card-hover p-4 rounded bg-black/50 border border-gray-700">
            <div className="flex justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">{note.title}</h2>
                <p className="text-gray-400 mt-1 whitespace-pre-line">{note.content}</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => startEditing(note)}
                  className="p-2 bg-blue-600 rounded hover:bg-blue-500"
                >
                  <Edit3 className="h-4 w-4 text-white" />
                </button>
                <button
                  onClick={() => handleDeleteNote(note.id)}
                  className="p-2 bg-red-600 rounded hover:bg-red-500"
                >
                  <Trash2 className="h-4 w-4 text-white" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
