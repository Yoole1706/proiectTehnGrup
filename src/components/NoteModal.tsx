"use client";

import { useEffect, useState } from "react";
import type { Note } from "@/context/NotesContext";
import NoteForm from "@/components/NoteForm";

type NoteModalProps = {
  note: Note;
  onClose: () => void;
};

export default function NoteModal({ note, onClose }: NoteModalProps) {
  const [isEditing, setIsEditing] = useState(false);

  
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const fmt = (iso: string) =>
    new Date(iso).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

  if (isEditing) {
    return <NoteForm initialNote={note} onClose={onClose} />;
  }

  return (
    
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm md:items-center"
      onClick={onClose}
    >
      
      <div
        className="flex w-full max-w-lg flex-col gap-5 rounded-t-2xl border border-zinc-800 bg-zinc-900 p-6 md:rounded-2xl md:max-h-[80vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              {note.category}
            </span>
            <h2 className="text-xl font-semibold text-zinc-100">
              {note.title}
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-md border border-zinc-700 px-3 py-1.5 text-sm text-zinc-300 transition-colors hover:bg-zinc-800 min-h-[44px]"
            >
              Edit
            </button>
            <button
              onClick={onClose}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100 min-h-[44px] min-w-[44px]"
              aria-label="Close"
            >
              ✕
            </button>
          </div>
        </div>

        
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-zinc-300">
          {note.body}
        </p>

        
        {note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {note.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        
        <div className="flex flex-col gap-0.5 border-t border-zinc-800 pt-4 text-xs text-zinc-500">
          <span>Created: {fmt(note.createdAt)}</span>
          <span>Updated: {fmt(note.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
}
