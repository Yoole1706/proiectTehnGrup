"use client";

import { useEffect, useState } from "react";
import { useNotesDispatch, type Note } from "@/context/NotesContext";

type NoteFormProps = {
  initialNote?: Note;
  onClose: () => void;
};

export default function NoteForm({ initialNote, onClose }: NoteFormProps) {
  const dispatch = useNotesDispatch();

  const [title, setTitle] = useState(initialNote?.title || "");
  const [body, setBody] = useState(initialNote?.body || "");
  const [category, setCategory] = useState(initialNote?.category || "");
  const [tagsInput, setTagsInput] = useState(initialNote?.tags.join(", ") || "");

  
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const canSubmit = title.trim().length > 0 && body.trim().length > 0;

  function handleSubmit() {
    if (!canSubmit) return;

    const now = new Date().toISOString();
    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    if (initialNote) {
      dispatch({
        type: "UPDATE_NOTE",
        payload: {
          id: initialNote.id,
          changes: {
            title: title.trim(),
            body: body.trim(),
            category: category.trim() || "Uncategorized",
            tags,
          },
        },
      });
    } else {
      const now = new Date().toISOString();
      const newNote: Note = {
        id: crypto.randomUUID(),
        title: title.trim(),
        body: body.trim(),
        category: category.trim() || "Uncategorized",
        tags,
        createdAt: now,
        updatedAt: now,
      };

      dispatch({ type: "ADD_NOTE", payload: newNote });
    }
    onClose();
  }

  const inputClasses =
    "w-full rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 min-h-[44px]";

  return (
    
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm md:items-center"
      onClick={onClose}
    >
      
      <div
        className="flex w-full max-w-lg flex-col gap-5 rounded-t-2xl border border-zinc-800 bg-zinc-900 p-6 md:rounded-2xl md:max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-100">
            {initialNote ? "Edit Note" : "Create Note"}
          </h2>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100 min-h-[44px] min-w-[44px]"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        
        <div className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400">Title</label>
            <input
              type="text"
              placeholder="Note title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputClasses}
            />
          </div>

          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400">Body</label>
            <textarea
              placeholder="Write your note…"
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className={`${inputClasses} resize-y min-h-[120px]`}
            />
          </div>

          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400">
              Category
            </label>
            <input
              type="text"
              placeholder="e.g. Personal, Work, Dev"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={inputClasses}
            />
          </div>

          
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-zinc-400">
              Tags{" "}
              <span className="font-normal text-zinc-500">
                (comma-separated)
              </span>
            </label>
            <input
              type="text"
              placeholder="tag1, tag2, tag3"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className={inputClasses}
            />
          </div>
        </div>

        
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="rounded-md border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800 min-h-[44px]"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="rounded-md bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-40 min-h-[44px]"
          >
            {initialNote ? "Save Changes" : "Create Note"}
          </button>
        </div>
      </div>
    </div>
  );
}
