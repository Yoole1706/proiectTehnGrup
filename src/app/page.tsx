"use client";

import { useState } from "react";
import { useNotes } from "@/context/NotesContext";
import NoteCard from "@/components/NoteCard";
import NoteModal from "@/components/NoteModal";
import NoteForm from "@/components/NoteForm";
import type { Note } from "@/context/NotesContext";

export default function Home() {
  const notes = useNotes();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="flex flex-1 flex-col bg-zinc-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-6">
          <h1 className="text-xl font-semibold text-zinc-100">All Notes</h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex h-10 items-center gap-2 rounded-md bg-zinc-100 px-4 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200 min-h-[44px]"
          >
            + Create Note
          </button>
        </div>

        {/* Grid */}
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-20">
            <p className="text-sm text-zinc-500">No notes yet.</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-sm font-medium text-zinc-300 underline underline-offset-4 transition-colors hover:text-zinc-100"
            >
              Create your first note
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onClick={() => setSelectedNote(note)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Note detail modal */}
      {selectedNote && (
        <NoteModal
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
        />
      )}

      {/* Create note modal */}
      {showForm && <NoteForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
