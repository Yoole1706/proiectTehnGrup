"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { getNotes, addNote } from "@/lib/firestore";

/* ── Note type ─────────────────────────────────────────────── */

export type Note = {
  id: string;
  title: string;
  body: string;
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
};

/* ── Actions ───────────────────────────────────────────────── */

type NotesAction = { type: "ADD_NOTE"; payload: Note };

/* ── Context ───────────────────────────────────────────────── */

const NotesContext = createContext<Note[]>([]);
const NotesDispatchContext = createContext<(action: NotesAction) => void>(
  () => {}
);

export function NotesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);

  /* Load notes from Firestore when user becomes available */
  const loadNotes = useCallback(async (uid: string) => {
    try {
      const fetched = await getNotes(uid);
      setNotes(fetched);
    } catch (error) {
      console.error("[NotesContext] loadNotes failed:", error);
    }
  }, []);

  useEffect(() => {
    if (user) {
      loadNotes(user.uid);
    } else {
      setNotes([]);
    }
  }, [user, loadNotes]);

  /* Dispatch wrapper — writes to Firestore then refreshes local state */
  const dispatch = useCallback(
    async (action: NotesAction) => {
      if (!user) return;

      switch (action.type) {
        case "ADD_NOTE": {
          const { id: _id, ...noteWithoutId } = action.payload;
          /* Optimistically add to local state */
          setNotes((prev) => [action.payload, ...prev]);
          try {
            /* Persist to Firestore */
            await addNote(user.uid, noteWithoutId);
            /* Re-fetch to sync real Firestore IDs */
            await loadNotes(user.uid);
          } catch (error) {
            console.error("[NotesContext] addNote failed:", error);
          }
          break;
        }
      }
    },
    [user, loadNotes]
  );

  return (
    <NotesContext.Provider value={notes}>
      <NotesDispatchContext.Provider value={dispatch}>
        {children}
      </NotesDispatchContext.Provider>
    </NotesContext.Provider>
  );
}

export function useNotes() {
  return useContext(NotesContext);
}

export function useNotesDispatch() {
  return useContext(NotesDispatchContext);
}
