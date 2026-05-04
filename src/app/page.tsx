"use client";

import { useMemo, useState } from "react";
import { useNotes } from "@/context/NotesContext";
import NoteCard from "@/components/NoteCard";
import NoteModal from "@/components/NoteModal";
import NoteForm from "@/components/NoteForm";
import type { Note } from "@/context/NotesContext";

type FilterChip = {
  kind: "category" | "tag";
  value: string;
};

export default function Home() {
  const notes = useNotes();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterChip | null>(null);

  
  const chips = useMemo(() => {
    const categories = new Set<string>();
    const tags = new Set<string>();

    for (const note of notes) {
      if (note.category) categories.add(note.category);
      for (const tag of note.tags) {
        if (tag) tags.add(tag);
      }
    }

    const result: FilterChip[] = [];
    for (const cat of categories) result.push({ kind: "category", value: cat });
    for (const tag of tags) result.push({ kind: "tag", value: tag });
    return result;
  }, [notes]);

  
  const filteredNotes = useMemo(() => {
    if (!activeFilter) return notes;
    if (activeFilter.kind === "category") {
      return notes.filter((n) => n.category === activeFilter.value);
    }
    return notes.filter((n) => n.tags.includes(activeFilter.value));
  }, [notes, activeFilter]);

  function toggleChip(chip: FilterChip) {
    setActiveFilter((prev) =>
      prev && prev.kind === chip.kind && prev.value === chip.value
        ? null
        : chip
    );
  }

  function isActive(chip: FilterChip) {
    return (
      activeFilter !== null &&
      activeFilter.kind === chip.kind &&
      activeFilter.value === chip.value
    );
  }

  
  const categoryChips = chips.filter((c) => c.kind === "category");
  const tagChips = chips.filter((c) => c.kind === "tag");
  const hasChips = chips.length > 0;

  return (
    <div className="flex flex-1 flex-col bg-zinc-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl">
        
        <div className="flex items-center justify-between pb-6">
          <h1 className="text-xl font-semibold text-zinc-100">All Notes</h1>
          <button
            onClick={() => setShowForm(true)}
            className="flex h-10 items-center gap-2 rounded-md bg-zinc-100 px-4 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200 min-h-[44px]"
          >
            + Create Note
          </button>
        </div>

        
        {notes.length > 0 && hasChips && (
          <div className="flex flex-row items-center gap-2 overflow-x-auto pb-4 scrollbar-none">
            {categoryChips.length > 0 && (
              <>
                <span className="shrink-0 self-center text-xs text-zinc-500">
                  Category
                </span>
                {categoryChips.map((chip) => (
                  <button
                    key={`cat-${chip.value}`}
                    onClick={() => toggleChip(chip)}
                    className={`shrink-0 rounded-full px-3 py-1 text-sm transition-colors ${
                      isActive(chip)
                        ? "bg-zinc-100 text-zinc-950"
                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    } cursor-pointer min-h-[44px]`}
                  >
                    {chip.value}
                  </button>
                ))}
              </>
            )}
            {tagChips.length > 0 && (
              <>
                <span className="shrink-0 self-center text-xs text-zinc-500">
                  Tag
                </span>
                {tagChips.map((chip) => (
                  <button
                    key={`tag-${chip.value}`}
                    onClick={() => toggleChip(chip)}
                    className={`shrink-0 rounded-full px-3 py-1 text-sm transition-colors ${
                      isActive(chip)
                        ? "bg-zinc-100 text-zinc-950"
                        : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                    } cursor-pointer min-h-[44px]`}
                  >
                    {chip.value}
                  </button>
                ))}
              </>
            )}
          </div>
        )}

        
        {filteredNotes.length === 0 && notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-20">
            <p className="text-sm text-zinc-500">No notes yet.</p>
            <button
              onClick={() => setShowForm(true)}
              className="text-sm font-medium text-zinc-300 underline underline-offset-4 transition-colors hover:text-zinc-100"
            >
              Create your first note
            </button>
          </div>
        ) : filteredNotes.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-20">
            <p className="text-sm text-zinc-500">
              No notes match this filter.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onClick={() => setSelectedNote(note)}
              />
            ))}
          </div>
        )}
      </div>

      
      {selectedNote && (
        <NoteModal
          note={selectedNote}
          onClose={() => setSelectedNote(null)}
        />
      )}

      
      {showForm && <NoteForm onClose={() => setShowForm(false)} />}
    </div>
  );
}
