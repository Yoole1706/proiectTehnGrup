"use client";

import type { Note } from "@/context/NotesContext";

type NoteCardProps = {
  note: Note;
  onClick: () => void;
};

export default function NoteCard({ note, onClick }: NoteCardProps) {
  const preview =
    note.body.length > 120 ? note.body.slice(0, 120) + "…" : note.body;

  const formattedDate = new Date(note.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
      className="flex flex-col gap-3 rounded-lg border border-zinc-800 bg-zinc-900 p-5 cursor-pointer transition-colors hover:border-zinc-700 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500 min-h-[44px]"
    >
      
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
          {note.category}
        </span>
        <time className="text-xs text-zinc-500" dateTime={note.createdAt}>
          {formattedDate}
        </time>
      </div>

      
      <h3 className="text-base font-semibold text-zinc-100 leading-snug">
        {note.title}
      </h3>

      
      <p className="text-sm leading-relaxed text-zinc-400">{preview}</p>

      
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
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
    </div>
  );
}
